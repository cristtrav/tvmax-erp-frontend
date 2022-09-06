import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TimbradosService } from '@servicios/timbrados.service';
import { Timbrado } from '@dto/timbrado.dto';
import { HttpParams } from '@angular/common/http';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Cliente } from '@dto/cliente-dto';
import { ClientesService } from '@servicios/clientes.service';
import { Suscripcion } from '@dto/suscripcion-dto';
import { Cuota } from '@dto/cuota-dto';
import { CuotasService } from '@servicios/cuotas.service';
import { ServiciosService } from '@servicios/servicios.service';
import { Servicio } from '@dto/servicio-dto';
import { DetalleFacturaVenta } from '@dto/detalle-factura-venta-dto';
import { formatDate } from '@angular/common';
import { FacturaVenta } from '@dto/factura-venta.dto';
import { VentasService } from '@servicios/ventas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Grupo } from '@dto/grupo-dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PortalOutlet, DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { Extra } from '@util/extra';
import { FacturaVentaComponent } from '../../impresion/factura-venta/factura-venta.component';
import { SesionService } from '@servicios/sesion.service';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss']
})
export class DetalleVentaComponent implements OnInit {

  @ViewChild("iframe") iframe!: ElementRef; // target host to render the printable
  private portalHost!: PortalOutlet;

  idventa: string = 'nueva'
  lstTimbrados: Timbrado[] = [];
  lstClientes: Cliente[] = [];
  lstSuscServCuotas: ISuscripcionServicioCuota[] = [];
  lstDetallesVenta: DetalleFacturaVenta[] = [];
  lstGruposServicios: IGrupoServicio[] = [];

  clienteSeleccionado: Cliente | null = null;

  formCabecera: UntypedFormGroup = this.formBuilder.group({
    nroFactura: [null, [Validators.required]],
    idTimbrado: [null, [Validators.required]],
    fecha: [new Date(), Validators.required],
    idCliente: [null, [Validators.required]]
  });

  errorTipNroFactura: string = 'hola mundo ';
  statusNroFactura: string = 'success';
  nroFacturaDesactivado: boolean = true;
  nroFacturaMax: number = 9999999;
  nroFacturaMin: number = 1;

  totalFactura: number = 0;
  totalIva5: number = 0;
  totalIva10: number = 0;
  totalCuotasPendientes: number = 0;

  loadingClientes: boolean = false;
  loadingMasClientes: boolean = false;
  loadingSuscripcionesCli: boolean = false;
  guardandoFactura: boolean = false;

  lastSearchStrCli: string = '';

  modalCuotasVisible: boolean = false;
  modalServiciosVisible: boolean = false;

  constructor(
    private timbradoSrv: TimbradosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private formBuilder: UntypedFormBuilder,
    private clienteSrv: ClientesService,
    private cuotasSrv: CuotasService,
    private serviciosSrv: ServiciosService,
    private ventasSrv: VentasService,
    private router: Router,
    private aroute: ActivatedRoute,
    private notif: NzNotificationService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef,
    private sesionSrv: SesionService
  ) { }

  ngOnInit(): void {
    const idv = this.aroute.snapshot.paramMap.get('idventa');
    if (idv) this.idventa = idv;
    this.cargarTimbrados();
    this.formCabecera.get('idTimbrado')?.valueChanges.subscribe((value: number | null) => {
      this.guardarUltimoTimbradoSeleccionado(this.sesionSrv.idusuario, value);
      if (value !== null) {
        this.timbradoSrv.getPorId(value).subscribe({
          next: (t) => {
            this.actualizarControlNroFactura(t);
            this.nroFacturaDesactivado = false;
          },
          error: (e) => {
            console.log('Error al cargar timbrado por id');
            console.log(e);
            this.httpErrorHandler.handle(e, "cargar último número de factura");
          }
        });
      } else {
        this.nroFacturaDesactivado = true;
      }
    });
    this.formCabecera.get('nroFactura')?.valueChanges.subscribe((value: number | null) => {
      this.actualizarValidacionTimbrado();
    });
    this.formCabecera.get('idCliente')?.valueChanges.subscribe((value: number | null) => {
      this.lstSuscServCuotas = [];
      this.totalCuotasPendientes = 0;
      this.lstDetallesVenta = [];
      this.cargarSuscripcionesCliente();
      this.calcularTotalFactura();
      if (value !== null) {
        this.cargarClienteSeleccionado(value);
      } else {
        this.clienteSeleccionado = null;
      }
    });
    this.cargarServicios();
    if (this.idventa !== 'nueva') this.cargarDatosVenta(Number(this.idventa));
    const idtimbradoPreferencia: number | null = this.getUltimoTimbradoSeleccionado(this.sesionSrv.idusuario);
    if (idtimbradoPreferencia) {
      this.formCabecera.get('idTimbrado')?.setValue(idtimbradoPreferencia);
    }
  }

  private getUltimoTimbradoSeleccionado(idfuncionario: number): number | null {
    let idtimbrado: number | null = null;
    if (typeof (Storage) !== 'undefined') {
      const clave: string = 'preferencias-detalle-venta';
      const preferenciasStr: string | null = localStorage.getItem(clave);
      let preferencias: any = preferenciasStr ? JSON.parse(preferenciasStr) : null;

      if (preferencias) {
        for (let pref of preferencias) {
          if (pref.idfuncionario === idfuncionario) {
            idtimbrado = pref.idUltimoTimbradoSeleccionado;
            break;
          }
        }
      }
    }
    return idtimbrado;
  }

  private guardarUltimoTimbradoSeleccionado(idfuncionario: number, idtimbrado: number | null) {
    if (typeof (Storage) !== 'undefined') {
      const clave: string = 'preferencias-detalle-venta';
      const preferenciasStr: string | null = localStorage.getItem(clave);
      let preferencias: any = preferenciasStr ? JSON.parse(preferenciasStr) : null;
      if (!preferencias) {
        preferencias = [
          {
            'idfuncionario': idfuncionario,
          }
        ]
      }
      for (let pref of preferencias) {
        if (pref.idfuncionario === idfuncionario) {
          pref.idUltimoTimbradoSeleccionado = idtimbrado;
          break;
        }
      }
      localStorage.setItem(clave, JSON.stringify(preferencias));
    }
  }

  private cargarClienteSeleccionado(id: number) {
    this.clienteSrv.getPorId(id).subscribe({
      next: (c) => {
        this.clienteSeleccionado = c;
      },
      error: (e) => {
        console.log('Error al cargar clente seleccionado');
        console.log(e);
        this.httpErrorHandler.handle(e, 'cargar datos del cliente seleccionado');
      }
    })
  }

  private cargarDatosVenta(idventa: number) {
    this.ventasSrv.getPorId(idventa).subscribe({
      next: (fv) => {
        if (fv.idcliente) this.clienteSrv.getPorId(fv.idcliente).subscribe({
          next: (cli) => {
            this.lstClientes = [cli];
            this.formCabecera.get('idCliente')?.setValue(fv.idcliente);
            this.totalFactura = fv.total;
            this.totalIva5 = fv.totaliva5;
            this.totalIva10 = fv.totaliva10;
            this.formCabecera.get('idTimbrado')?.setValue(fv.idtimbrado);
            this.formCabecera.get('nroFactura')?.setValue(fv.nrofactura);
            this.lstDetallesVenta = fv.detalles;
            if (fv.fechafactura) this.formCabecera.get('fecha')?.setValue(new Date(Date.parse(fv.fechafactura)));
          },
          error: (er) => {
            console.log('Error al cargar cliente de la factura')
            console.log(er);
            this.httpErrorHandler.handle(er);
          }
        });
      },
      error: (e) => {
        console.log('Error al cargar venta por id')
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    });
  }

  actualizarControlNroFactura(t: Timbrado) {
    this.nroFacturaMin = t.nroinicio ?? 1;
    this.nroFacturaMax = t.nrofin ?? 9999999;
    this.formCabecera.get('nroFactura')?.clearValidators();
    this.formCabecera.get('nroFactura')?.addValidators([Validators.required, Validators.min(this.nroFacturaMin), Validators.max(this.nroFacturaMax)]);
    this.formCabecera.get('nroFactura')?.setValue(t.ultnrousado ? Number(t.ultnrousado) + 1 : this.nroFacturaMin);
  }

  actualizarControlNroFacturaSeleccionado() {
    if (this.formCabecera.get('idTimbrado')?.value) {
      const idtimb: number = this.formCabecera.get('idTimbrado')?.value;
      for (let t of this.lstTimbrados) {
        if (t.id === idtimb) {
          this.actualizarControlNroFactura(t);
          break;
        }
      }
    }

  }

  private cargarTimbrados() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('activo', 'true');
    this.timbradoSrv.get(params).subscribe({
      next: (resp) => {
        this.lstTimbrados = resp.data;
        this.actualizarControlNroFacturaSeleccionado();
      },
      error: (e) => {
        console.log('Error al consultar timbrados');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    });
  }

  formatPrefijoTimbrado(timb: Timbrado): string {
    const codEst: string = timb.codestablecimiento ? timb.codestablecimiento.toString().padStart(3, '0') : '';
    const codPE: string = timb.codpuntoemision ? timb.codpuntoemision.toString().padStart(3, '0') : '';

    return `${codEst}-${codPE}`;
  }

  rangoTimbrado(timb: Timbrado): string {
    const nroIni: string = timb.nroinicio ? timb.nroinicio.toString().padStart(7, '0') : '';
    const nroFin: string = timb.nrofin ? timb.nrofin.toString().padStart(7, '0') : '';
    return `De ${nroIni} al ${nroFin}`;
  }

  formatFechaVencimiento(timb: Timbrado): string {
    let fvStr: string = '';
    if (timb.fechavencimiento) {
      const fv: Date = new Date(timb.fechavencimiento);
      fvStr = `${fv.getDate().toString().padStart(2, '0')}/${(fv.getMonth() + 1).toString().padStart(2, '0')}/${fv.getFullYear()}`;
    }
    return fvStr;
  }

  actualizarValidacionTimbrado() {
    if (this.formCabecera.controls['idTimbrado'].hasError('required')) {
      this.statusNroFactura = 'error';
      this.errorTipNroFactura = 'Seleccione un timbrado.';
    } else if (this.formCabecera.controls['nroFactura'].hasError('required')) {
      this.statusNroFactura = 'error';
      this.errorTipNroFactura = `Ingrese un núm. Mín. ${this.nroFacturaMin}, máx. ${this.nroFacturaMax}.`;
    } else {
      this.statusNroFactura = 'success';
    }
  }

  private validado(): boolean {
    let val = true;
    this.actualizarValidacionTimbrado();
    Object.keys(this.formCabecera.controls).forEach((key) => {
      const ctrl = this.formCabecera.get(key);
      if (ctrl !== null) {
        if (!ctrl.disabled) {
          if (!ctrl.valid) {
            ctrl.markAsDirty();
            ctrl.updateValueAndValidity();
          }
          val = val && ctrl.valid;
        }
      }
    });
    return val;
  }

  guardar() {
    if (this.validado()) {
      if (this.idventa === 'nueva') this.registrar();
      else this.notif.create('error', 'Error', 'La funcion todavia no esta implementada bro');
    }
  }

  private registrar() {
    this.guardandoFactura = true;
    this.ventasSrv.post(this.getDtoFacturaVenta()).subscribe({
      next: (idgenerado) => {
        this.guardandoFactura = false;
        this.idventa = `${idgenerado}`;
        this.router.navigate(['../', idgenerado], { relativeTo: this.aroute });
        this.cargarSuscripcionesCliente();
        this.notif.create('success', '<strong>Éxito</strong>', 'Se guardó la factura de venta correctamente.');
      },
      error: (e) => {
        console.log('Error al registrar venta');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.guardandoFactura = false;
      }
    });
  }

  buscarCliente(consulta: string) {
    this.lastSearchStrCli = consulta;
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('limit', '20');
    params = params.append('offset', '0');
    if (consulta.length > 0) params = params.append('search', consulta);
    this.loadingClientes = true;
    this.clienteSrv.get(params).subscribe({
      next: (resp) => {
        this.lstClientes = resp.data;
        this.loadingClientes = false;
      },
      error: (e) => {
        console.log('Error al buscar cliente');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.loadingClientes = false;
      }
    });
  }

  cargarMasClientes() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if (this.lastSearchStrCli.length > 0) params = params.append('search', this.lastSearchStrCli);
    params = params.append('limit', '10');
    params = params.append('offset', `${this.lstClientes.length}`);
    this.loadingMasClientes = true;
    this.clienteSrv.get(params).subscribe({
      next: (resp) => {
        this.lstClientes = [...this.lstClientes, ...resp.data];
        this.loadingMasClientes = false;
      },
      error: (e) => {
        console.log('Error al cargar mas clientes');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.loadingMasClientes = false;
      }
    });
  }

  mostrarModalCuotas() {
    this.modalCuotasVisible = true;
  }

  ocultarModalCuotas() {
    this.modalCuotasVisible = false;
  }

  despuesDeOcultarModalCuotas() {
    this.lstSuscServCuotas = [];
  }

  cargarServiciosCuotasPendientes() {
    this.lstSuscServCuotas.forEach((sc: ISuscripcionServicioCuota) => {
      let paramsServicios: HttpParams = new HttpParams();
      paramsServicios = paramsServicios.append('eliminado', 'false');
      paramsServicios = paramsServicios.append('pagado', 'false');
      sc.loadingServicios = true;
      if (sc.suscripcion.id) {
        this.serviciosSrv.getServiciosPorCuotasDeSuscripcion(sc.suscripcion.id, paramsServicios).subscribe((resp: ServerResponseList<Servicio>) => {
          const arrSrvCuo: IServicioCuota[] = [];
          resp.data.forEach((s: Servicio) => {
            arrSrvCuo.push({ servicio: s, cuotas: [], loadingCuotas: false });
          });
          sc.servicioscuotas = arrSrvCuo;
          sc.loadingServicios = false;
          this.cargarCuotasPendientes();
        }, (e) => {
          console.log('Error al consultar servicios de cuotas pendientes');
          console.log(e);
          this.httpErrorHandler.handle(e);
          sc.loadingServicios = false;
        });

      }
    });
  }

  cargarCuotasPendientes() {
    this.lstSuscServCuotas.forEach((suscservcuo: ISuscripcionServicioCuota) => {
      suscservcuo.servicioscuotas.forEach((servcuo: IServicioCuota) => {
        let paramsCuotas: HttpParams = new HttpParams();
        paramsCuotas = paramsCuotas.append('eliminado', 'false');
        paramsCuotas = paramsCuotas.append('pagado', 'false');
        paramsCuotas = paramsCuotas.append('sort', '-fecha_vencimiento');
        paramsCuotas = paramsCuotas.append('idsuscripcion', `${suscservcuo.suscripcion.id}`);
        paramsCuotas = paramsCuotas.append('idservicio', `${servcuo.servicio.id}`);

        servcuo.loadingCuotas = true;
        this.cuotasSrv.get(paramsCuotas).subscribe({
          next: (resp) => {
            const arrCuotas: ICuotaDetalle[] = [];
            for (let c of resp.data) {
              arrCuotas.push({ cuota: c, enDetalle: this.existeCuotaEnDetalle(c.id) });
            }
            servcuo.cuotas = arrCuotas;
            servcuo.loadingCuotas = false;
          },
          error: (e) => {
            console.log(`Error al cargar las cuotas del servicio ${suscservcuo.servicioscuotas}`);
            console.log(e);
            this.httpErrorHandler.handle(e);
            servcuo.loadingCuotas = false;
          }
        });
      });
    });

  }

  cargarSuscripcionesCliente() {
    const idcli: number = this.formCabecera.get('idCliente')?.value;
    if (idcli) {
      this.loadingSuscripcionesCli = true;
      let params: HttpParams = new HttpParams();
      params = params.append('eliminado', 'false');
      this.clienteSrv.getSuscripcionesPorCliente(idcli, params).subscribe({
        next: (resp) => {
          const arrSusCuotas: ISuscripcionServicioCuota[] = [];
          let totalCuoutas: number = 0;
          resp.data.forEach((s) => {
            totalCuoutas += Number(s.cuotaspendientes);
            arrSusCuotas.push({ suscripcion: s, servicioscuotas: [], loadingServicios: false, cuotasPendientes: s.cuotaspendientes });
          });
          this.totalCuotasPendientes = totalCuoutas;
          this.lstSuscServCuotas = arrSusCuotas;
          this.loadingSuscripcionesCli = false;
          this.cargarServiciosCuotasPendientes();
        },
        error: (e) => {
          console.log('Error al cargar suscripciones');
          console.log(e);
          this.httpErrorHandler.handle(e);
          this.loadingSuscripcionesCli = false;
        }
      });
    } else {
      this.lstSuscServCuotas = [];
      this.totalCuotasPendientes = 0;
    }
  }

  agregarCuotaDetalle(c: ICuotaDetalle) {
    const dfv: DetalleFacturaVenta = new DetalleFacturaVenta();
    dfv.cantidad = 1;
    dfv.monto = c.cuota.monto;
    dfv.subtotal = dfv.monto * dfv.cantidad;
    dfv.porcentajeiva = Number(c.cuota.porcentajeiva);
    dfv.idsuscripcion = c.cuota.idsuscripcion;
    dfv.idservicio = c.cuota.idservicio;
    dfv.idcuota = c.cuota.id;
    const vencStr: string = c.cuota.fechavencimiento ? formatDate(c.cuota.fechavencimiento, 'MMM yyyy', 'es-PY').toUpperCase() : '';
    dfv.descripcion = `CUOTA ${vencStr} | ${c.cuota.servicio} [${c.cuota.idsuscripcion}]`.toUpperCase();
    const arrDFV: DetalleFacturaVenta[] = this.lstDetallesVenta.slice();
    arrDFV.push(dfv);
    this.lstDetallesVenta = arrDFV;
    c.enDetalle = true;
    this.calcularTotalFactura();
  }

  quitarCuotaDetalle(c: ICuotaDetalle) {
    for (let i = 0; i < this.lstDetallesVenta.length; i++) {
      if (this.lstDetallesVenta[i].idcuota === c.cuota.id) {
        c.enDetalle = false;
        this.quitarDetalleFactura(i);
        break;
      }
    }
  }

  existeCuotaEnDetalle(idcuota: number | null): boolean {
    if (idcuota) for (let dfv of this.lstDetallesVenta) {
      if (dfv.idcuota === idcuota) return true;
    }
    return false;
  }

  quitarDetalleFactura(indice: number) {
    const idcuota: number = this.lstDetallesVenta[indice].idcuota ?? 0;
    const arrDfv: DetalleFacturaVenta[] = this.lstDetallesVenta.slice();
    arrDfv.splice(indice, 1);
    this.lstDetallesVenta = arrDfv;
    if (idcuota !== null) {
      for (let s of this.lstSuscServCuotas) {
        for (let srv of s.servicioscuotas) {
          for (let c of srv.cuotas) {
            if (c.cuota.id === idcuota) {
              c.enDetalle = false;
              break;
            }
          }
        }
      }
    }
    this.calcularTotalFactura();
  }

  calcularTotalFactura() {
    this.totalFactura = 0;
    this.totalIva5 = 0;
    this.totalIva10 = 0;
    for (let dfv of this.lstDetallesVenta) {
      this.totalFactura += dfv.subtotal ?? 0;
      if (Number(dfv.porcentajeiva) === 5 && dfv.subtotal !== null) {
        this.totalIva5 += Math.round((dfv.subtotal * 5) / 105);
      }
      if (Number(dfv.porcentajeiva) === 10 && dfv.subtotal !== null) {
        this.totalIva10 += Math.round((dfv.subtotal * 10) / 110);
      }
    }
  }

  getDtoFacturaVenta(): FacturaVenta {
    const fv: FacturaVenta = new FacturaVenta();
    fv.total = this.totalFactura;
    fv.detalles = this.lstDetallesVenta;
    fv.idtimbrado = this.formCabecera.get('idTimbrado')?.value;
    fv.nrofactura = this.formCabecera.get('nroFactura')?.value;
    fv.pagado = true;
    fv.idcliente = this.formCabecera.get('idCliente')?.value;
    const date: Date = this.formCabecera.get('fecha')?.value;
    fv.fechafactura = formatDate(date, 'yyyy/MM/dd', 'es-PY');
    fv.fechacobro = formatDate(date, 'yyyy/MM/dd', 'es-PY');
    fv.idfuncionarioregistrocobro = this.sesionSrv.idusuario;
    if (this.clienteSeleccionado?.idcobrador) fv.idcobradorcomision = this.clienteSeleccionado?.idcobrador;
    fv.idfuncionarioregistrofactura = this.sesionSrv.idusuario;
    return fv;
  }

  limpiar() {
    this.cargarTimbrados();
    this.formCabecera.controls['idCliente']?.reset();
    this.router.navigate(['../', 'nueva'], { relativeTo: this.aroute });
    this.idventa = 'nueva';
    this.calcularTotalFactura();
  }

  cargarServicios() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('suscribible', 'false');
    this.serviciosSrv.getServicios(params).subscribe({
      next: (resp) => {
        const lstgs: IGrupoServicio[] = [];
        for (let s of resp.data) {
          let existe: boolean = false;
          for (let gs of lstgs) {
            if (s.idgrupo === gs.grupo.id) {
              existe = true;
              gs.servicios.push(s);
            }
          }
          if (!existe) {
            lstgs.push({ grupo: { id: s.idgrupo, descripcion: s.grupo }, servicios: [s] });
          }
        }
        this.lstGruposServicios = lstgs;
      },
      error: (e) => {
        console.log('Error al cargar servicios');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    });
  }

  agregarServicioDetalle(srv: Servicio, susc: Suscripcion) {
    const lstdt: DetalleFacturaVenta[] = this.lstDetallesVenta.slice();
    const dt: DetalleFacturaVenta = new DetalleFacturaVenta();
    dt.cantidad = 1;
    dt.monto = srv.precio;
    dt.idservicio = srv.id;
    dt.subtotal = dt.monto * dt.cantidad;
    dt.idsuscripcion = susc.id;
    dt.porcentajeiva = srv.porcentajeiva;
    dt.descripcion = `${srv.descripcion} | ${susc.servicio} [${susc.id}]`.toUpperCase();
    lstdt.push(dt);
    this.lstDetallesVenta = lstdt;
    this.calcularTotalFactura();
  }

  imprimir(): void {
    const iframe = this.iframe.nativeElement;
    iframe.contentDocument.title = "TVMax ERP";
    this.portalHost = new DomPortalOutlet(
      iframe.contentDocument.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
    const portal = new ComponentPortal(FacturaVentaComponent, this.viewContainerRef);
    const attachObj = this.portalHost.attach(portal);
    attachObj.instance.cargarFactura(this.idventa);
    let timer: any;
    attachObj.instance.dataLoaded.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        iframe.contentWindow.print();
      }, 250);
    });
    iframe.contentWindow.onafterprint = () => {
      iframe.contentDocument.body.innerHTML = "";
    };
    Extra.agregarCssImpresion(iframe.contentWindow);
  }
}

interface ISuscripcionServicioCuota {
  suscripcion: Suscripcion;
  servicioscuotas: IServicioCuota[];
  loadingServicios: boolean;
  cuotasPendientes: number;
}

interface IServicioCuota {
  servicio: Servicio;
  cuotas: ICuotaDetalle[];
  loadingCuotas: boolean;
}

interface ICuotaDetalle {
  cuota: Cuota;
  enDetalle: boolean;
}

interface IGrupoServicio {
  grupo: Grupo;
  servicios: Servicio[];
}