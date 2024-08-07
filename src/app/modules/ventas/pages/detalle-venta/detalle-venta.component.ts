import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TimbradosService } from '@services/timbrados.service';
import { HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '@services/clientes.service';
import { formatDate } from '@angular/common';
import { VentasService } from '@services/ventas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SesionService } from '@services/sesion.service';
import { CuotasPendientesComponent } from '../../components/cuotas-pendientes/cuotas-pendientes.component';
import { finalize, forkJoin } from 'rxjs';
import { ImpresionService } from '@services/impresion.service';
import { Cliente } from '@dto/cliente-dto';
import { CuotaDTO } from '@dto/cuota-dto';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { Timbrado } from '@dto/timbrado.dto';
import { Venta } from '@dto/venta.dto';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss']
})
export class DetalleVentaComponent implements OnInit {

  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  @ViewChild('cuotasPendientes')
  cuotasPendientesComp!: CuotasPendientesComponent;

  idventa: string = 'nueva'
  lstTimbrados: Timbrado[] = [];
  lstClientes: Cliente[] = [];
  lstDetallesVenta: DetalleVenta[] = [];
  dvRuc: string | null = null;

  formCabecera: FormGroup = new FormGroup({
    nroFactura: new FormControl(null, [Validators.required]),
    idTimbrado: new FormControl(null, [Validators.required]),
    fecha: new FormControl(new Date(), Validators.required),
    idCliente: new FormControl(null, [Validators.required]),
    ci: new FormControl(null)
  });

  errorTipNroFactura: string = 'hola mundo ';
  statusNroFactura: string = 'success';
  nroFacturaDesactivado: boolean = true;
  nroFacturaMax: number = 9999999;
  nroFacturaMin: number = 1;

  totalFactura: number = 0;
  totalIva5: number = 0;
  totalGravado5: number = 0;
  totalIva10: number = 0;
  totalGravado10: number = 0;
  totalExento: number = 0;
  totalCuotasPendientes: number = 0;

  loadingClientes: boolean = false;
  loadingMasClientes: boolean = false;
  loadingCantidadCuotas: boolean = false;
  guardandoFactura: boolean = false;

  lastSearchStrCli: string = '';

  modalCuotasVisible: boolean = false;
  modalServiciosVisible: boolean = false;

  mapCuotaEnDetalle: Map<number, boolean> = new Map();
  loadingImpresion: boolean = false;

  buscandoFactura: boolean = false;
  moduloActivadoDesde: 'venta' | 'pos' = 'venta';

  constructor(
    private timbradoSrv: TimbradosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private clienteSrv: ClientesService,
    private ventasSrv: VentasService,
    private router: Router,
    private aroute: ActivatedRoute,
    private notif: NzNotificationService,
    private viewContainerRef: ViewContainerRef,
    private sesionSrv: SesionService,
    private impresionSrv: ImpresionService
  ) { }

  ngOnInit(): void {
    this.idventa = this.aroute.snapshot.paramMap.get('idventa') ?? 'nueva';
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
            console.log('Error al cargar timbrado por id', e);
            this.httpErrorHandler.process(e);
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
      const cliente = this.lstClientes.find(cliente => cliente.id == value);
      if (this.idventa === 'nueva') this.lstDetallesVenta = [];

      if (value) this.calcularTotalCuotasPendientes(value)
      else this.totalCuotasPendientes = 0;

      if (value && !cliente) this.agregarClienteALista(value);
      if (cliente) {
        this.formCabecera.controls.ci.setValue(cliente.ci);
        this.dvRuc = cliente.dvruc != null ? `${cliente.dvruc}` : null;
      } else {
        this.formCabecera.controls.ci.setValue(null);
        this.dvRuc = null;
      }
      this.calcularTotalFactura();
    });

    if (this.idventa !== 'nueva') this.cargarDatosVenta(Number(this.idventa));

    this.formCabecera.get('idTimbrado')?.setValue(this.getUltimoTimbradoSeleccionado(this.sesionSrv.idusuario));
    this.moduloActivadoDesde = this.router.routerState.snapshot.url.includes('pos') ? 'pos' : 'venta';
  }

  private getUltimoTimbradoSeleccionado(idusuario: number): number | null {

    if (typeof (Storage) === 'undefined') return null
    const preferenciasStr: string = localStorage.getItem('preferencias-detalle-venta') ?? '[]';

    let preferencias: { idusuario: number, idUltimoTimbradoSeleccionado: number }[] = JSON.parse(preferenciasStr);
    const pref = preferencias.find(preferencia => preferencia.idusuario == idusuario);
    if (pref) return Number(pref.idUltimoTimbradoSeleccionado);
    else return null;
  }

  private guardarUltimoTimbradoSeleccionado(idusuario: number, idtimbrado: number | null) {
    if (typeof (Storage) === 'undefined') return;

    const clave: string = 'preferencias-detalle-venta';
    let preferencias: {
      idusuario: number,
      idUltimoTimbradoSeleccionado: number
    }[] = JSON.parse(localStorage.getItem('preferencias-detalle-venta') ?? '[]');

    preferencias = preferencias.filter(pref => pref.idusuario != idusuario);
    if (idtimbrado) preferencias.push({ idusuario: idusuario, idUltimoTimbradoSeleccionado: idtimbrado });

    localStorage.setItem(clave, JSON.stringify(preferencias));
  }

  private agregarClienteALista(idcliente: number) {
    this.loadingClientes = true;
    this.clienteSrv.getPorId(idcliente).subscribe({
      next: (cliente) => {
        this.lstClientes.push(cliente);
        this.loadingClientes = false;
      },
      error: (e) => {
        console.error('Error al cargar clente seleccionado', e);
        this.httpErrorHandler.process(e);
        this.loadingClientes = false;
      }
    })
  }

  private cargarDatosVenta(idventa: number) {
    const paramsDetalle = new HttpParams().append('eliminado', 'false');
    forkJoin({
      venta: this.ventasSrv.getPorId(idventa),
      detalles: this.ventasSrv.getDetallePorIdVenta(idventa, paramsDetalle)
    }).subscribe({
      next: (resp) => {
        this.formCabecera.get('idCliente')?.setValue(resp.venta.idcliente);
        this.dvRuc = resp.venta.dvruc != null ? `${resp.venta.dvruc}` : null;
        this.formCabecera.get('ci')?.setValue(resp.venta.ci);
        this.totalFactura = resp.venta.total;
        this.totalIva5 = resp.venta.totaliva5;
        this.totalIva10 = resp.venta.totaliva10;
        this.formCabecera.get('idTimbrado')?.setValue(resp.venta.idtimbrado);
        this.formCabecera.get('nroFactura')?.setValue(resp.venta.nrofactura);
        this.lstDetallesVenta = resp.detalles;
        console.log(resp.venta.fechafactura);
        if (resp.venta.fechafactura) this.formCabecera.get('fecha')?.setValue(new Date(resp.venta.fechafactura));
      },
      error: (e) => {
        console.error('Error al cargar venta por id', e)
        this.httpErrorHandler.process(e);
      }
    })
  }

  actualizarControlNroFactura(t: Timbrado) {
    this.nroFacturaMin = t.nroinicio ?? 1;
    this.nroFacturaMax = t.nrofin ?? 9999999;
    this.formCabecera.get('nroFactura')?.clearValidators();
    this.formCabecera.get('nroFactura')?.addValidators([Validators.required, Validators.min(this.nroFacturaMin), Validators.max(this.nroFacturaMax)]);
    if(this.idventa == 'nueva')
      this.formCabecera.get('nroFactura')?.setValue(t.ultimonrousado ? Number(t.ultimonrousado) + 1 : this.nroFacturaMin);
  }

  actualizarControlNroFacturaSeleccionado() {
    if (!this.formCabecera.controls.idTimbrado.value) return;
    const timbrado = this.lstTimbrados.find(timbrado => timbrado.id == this.formCabecera.controls.idTimbrado.value);
    if (!timbrado) return;
    this.actualizarControlNroFactura(timbrado);
  }

  private cargarTimbrados() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('activo', 'true');
    this.timbradoSrv.get(params).subscribe({
      next: (timbrados) => {
        this.lstTimbrados = timbrados;
        this.actualizarControlNroFacturaSeleccionado();
      },
      error: (e) => {
        console.log('Error al consultar timbrados', e);
        this.httpErrorHandler.process(e);
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

  guardar() {
    Object.keys(this.formCabecera).forEach(ctrlName => {
      this.formCabecera.get(ctrlName)?.markAsDirty();
      this.formCabecera.get(ctrlName)?.updateValueAndValidity();
    })
    if(this.lstDetallesVenta.length === 0){
      this.notif.create('error', '<strong>Error de validación</strong>', 'No se agregó ningún ítem a la factura');
    }
    if (this.formCabecera.valid && this.lstDetallesVenta.length > 0) {
      if (this.idventa === 'nueva') this.registrar();
      else this.editar();
    }
  }

  private registrar() {
    this.guardandoFactura = true;
    this.ventasSrv.post(this.getDtoFacturaVenta()).subscribe({
      next: (idgenerado) => {
        this.guardandoFactura = false;
        this.idventa = `${idgenerado}`;
        this.router.navigate(['../', idgenerado], { relativeTo: this.aroute });
        this.notif.create('success', '<strong>Éxito</strong>', 'Factura registrada.');
        this.calcularTotalCuotasPendientes(this.formCabecera.controls.idCliente.value);
        //this.cargarDatosVenta(idgenerado);
      },
      error: (e) => {
        console.error('Error al registrar venta', e);
        this.httpErrorHandler.process(e);
        this.guardandoFactura = false;
      }
    });
  }

  private editar(){
    this.guardandoFactura = true;
    this.ventasSrv.put(this.getDtoFacturaVenta()).subscribe({
      next: () => {
        this.guardandoFactura = false;
        this.notif.create('success', '<strong>Éxito</strong>', 'Venta editada');
        this.calcularTotalCuotasPendientes(this.formCabecera.controls.idCliente.value);
        this.cargarDatosVenta(Number(this.idventa));
      },
      error: (e) => {
        console.error('Error al editar venta', e);
        this.httpErrorHandler.process(e);
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
    if (consulta) params = params.append('search', consulta);
    this.loadingClientes = true;
    this.clienteSrv.get(params).subscribe({
      next: (clientes) => {
        this.lstClientes = clientes;
        this.loadingClientes = false;
      },
      error: (e) => {
        console.error('Error al buscar cliente', e);
        this.httpErrorHandler.process(e);
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
      next: (clientes) => {
        this.lstClientes = [...this.lstClientes, ...clientes];
        this.loadingMasClientes = false;
      },
      error: (e) => {
        console.error('Error al cargar mas clientes', e);
        this.httpErrorHandler.process(e);
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

  agregarCuotaDetalle(cuota: CuotaDTO) {
    const dfv: DetalleVenta = new DetalleVenta();
    dfv.cantidad = 1;
    dfv.monto = cuota.monto ?? 0;
    dfv.subtotal = dfv.monto * dfv.cantidad;
    dfv.porcentajeiva = Number(cuota.porcentajeiva);
    dfv.idsuscripcion = cuota.idsuscripcion ?? -1;
    dfv.idservicio = cuota.idservicio ?? -1;
    dfv.idcuota = cuota.id ?? -1;
    dfv.montoiva = Math.round((dfv.subtotal * dfv.porcentajeiva) / (100 + dfv.porcentajeiva));
    const vencStr: string = cuota.fechavencimiento ? formatDate(cuota.fechavencimiento, 'MMM yyyy', 'es-PY').toUpperCase() : '';
    dfv.descripcion = `CUOTA ${vencStr} | ${cuota.servicio} [${cuota.idsuscripcion}]`.toUpperCase();
    const arrDFV: DetalleVenta[] = this.lstDetallesVenta.slice();
    arrDFV.push(dfv);
    this.lstDetallesVenta = arrDFV;
    this.mapCuotaEnDetalle.set(cuota.id ?? -1, true);
    this.calcularTotalFactura();
  }

  quitarCuotaDetalle(cuota: CuotaDTO) {
    const index = this.lstDetallesVenta.findIndex(detalle => detalle.idcuota == cuota.id);    
    if (index != -1) this.quitarDetalleFactura(index);
    this.mapCuotaEnDetalle.set(cuota.id ?? -1, false);
  }

  quitarDetalleFactura(indice: number) {
    const idcuota = this.lstDetallesVenta[indice].idcuota;
    if (idcuota) this.mapCuotaEnDetalle.set(idcuota, false);
    this.lstDetallesVenta = this.lstDetallesVenta.filter((detalle, i) => i != indice);
    this.calcularTotalFactura();
  }

  calcularTotalFactura() {
    this.totalFactura = 0;
    this.totalIva5 = 0;
    this.totalIva10 = 0;
    this.totalGravado10 = 0;
    this.totalGravado5 = 0;
    this.totalExento = 0;
    for (let dfv of this.lstDetallesVenta) {
      this.totalFactura += Number(dfv.subtotal) ?? 0;
      if (Number(dfv.porcentajeiva) === 5 && dfv.subtotal != null) {
        this.totalIva5 += Math.round((dfv.subtotal * 5) / 105);
        this.totalGravado5 += Number(dfv.subtotal);
      }
      if (Number(dfv.porcentajeiva) === 10 && dfv.subtotal != null) {
        this.totalIva10 += Math.round((dfv.subtotal * 10) / 110);
        this.totalGravado10 += Number(dfv.subtotal);
      }
      if (Number(dfv.porcentajeiva) === 0 && dfv.subtotal != null){
        this.totalExento += Number(dfv.subtotal);
      }
    }
  }

  getDtoFacturaVenta(): Venta {
    const fv: Venta = new Venta();
    if(this.idventa != 'nueva') fv.id = Number(this.idventa);
    fv.total = this.totalFactura;
    fv.totaliva10 = this.totalIva10;
    fv.totaliva5 = this.totalIva5;
    fv.totalgravadoiva10 = this.totalGravado10;
    fv.totalgravadoiva5 = this.totalGravado5;
    fv.totalexentoiva = this.totalExento;
    fv.detalles = this.lstDetallesVenta;
    fv.idtimbrado = this.formCabecera.get('idTimbrado')?.value;
    fv.nrofactura = this.formCabecera.get('nroFactura')?.value;
    fv.pagado = true;
    fv.idcliente = this.formCabecera.get('idCliente')?.value;
    const date: Date = this.formCabecera.get('fecha')?.value;
    const fechaSinHora: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    fv.fechacobro = fechaSinHora;
    fv.fechafactura = fechaSinHora;
    fv.idusuarioregistrocobro = this.sesionSrv.idusuario;
    const cliente = this.lstClientes.find(cliente => cliente.id == this.formCabecera.controls.idCliente.value);
    fv.idcobradorcomision = cliente?.idcobrador ?? null;
    //if (cliente && cliente.idcobrador) fv.idcobradorcomision = cliente.idcobrador;
    fv.idusuarioregistrofactura = this.sesionSrv.idusuario;
    return fv;
  }

  limpiar() {
    this.mapCuotaEnDetalle.clear();
    this.cargarTimbrados();
    this.formCabecera.controls['idCliente']?.reset();
    this.router.navigate(['../', 'nueva'], { relativeTo: this.aroute });
    this.idventa = 'nueva';
    this.lstDetallesVenta = [];
    this.calcularTotalFactura();
  }

  agregarServicioDetalle(srv: Servicio, susc: Suscripcion) {
    const lstdt: DetalleVenta[] = this.lstDetallesVenta.slice();
    const dt: DetalleVenta = new DetalleVenta();
    dt.cantidad = 1;
    dt.monto = srv.precio ?? null;
    dt.idservicio = srv.id ?? null;
    dt.subtotal = (dt.monto ?? 0) * dt.cantidad;
    dt.idsuscripcion = susc.id;
    dt.porcentajeiva = Number(srv.porcentajeiva);
    dt.montoiva = Math.round((dt.subtotal * dt.porcentajeiva) / (100 + dt.porcentajeiva));
    dt.descripcion = `${srv.descripcion} | ${susc.servicio} [${susc.id}]`.toUpperCase();
    lstdt.push(dt);
    this.lstDetallesVenta = lstdt;
    this.calcularTotalFactura();
  }

  imprimir(): void {
    this.impresionSrv.imprimirFacturaPreimpresa( Number(this.idventa), this.iframe, this.viewContainerRef)
    .subscribe((loading) => this.loadingImpresion = loading);
  }

  calcularTotalCuotasPendientes(idcliente: number) {
    this.loadingCantidadCuotas = true;
    let params = new HttpParams()
      .append('eliminado', 'false');
    this.clienteSrv.getSuscripcionesPorCliente(idcliente, params).subscribe({
      next: (suscripciones) => {
        let totalPendiente = 0
        suscripciones.forEach(suscripcion => totalPendiente += Number(suscripcion.cuotaspendientes));
        this.totalCuotasPendientes = totalPendiente;
        this.loadingCantidadCuotas = false;
      },
      error: (e) => {
        console.error('Error al consultar suscripciones por cliente', e);
        this.loadingCantidadCuotas = false;
      }
    })
  }

  buscarClientePorCi(event: any) {
    const ci = this.formCabecera.controls.ci.value;
    if (ci) {
      const params = new HttpParams()
        .append('eliminado', 'false')
        .append('ci', ci);
      this.clienteSrv.get(params).subscribe({
        next: (clientes) => {
          if (clientes.length === 0) {
            this.notif.create('warning', 'No encontrado', `No se encontró ningun cliente con CI: ${ci}`);
            event.target.select();
          } else {
            if (!this.lstClientes.find(cliente => cliente.ci == ci)) this.lstClientes.push(clientes[0]);
            this.formCabecera.controls.idCliente.setValue(clientes[0].id);
          }
        },
        error: (e) => {
          console.log('Error al buscar cliente por ci', e);
          this.httpErrorHandler.process(e);
        }
      });
    }
  }

  buscarFacturaPorNro(){
    if(!this.formCabecera.controls.idTimbrado.value){
      this.notif.create('warning', 'Seleccione el prefijo de la factura','');
      return;
    }
    if(!this.formCabecera.controls.nroFactura.value){
      this.notif.create('warning', 'Ingrese un número de factura','');
      return;
    }
    this.buscandoFactura = true;
    const httpParams = new HttpParams()
    .append('eliminado', false)
    .append('idtimbrado', `${this.formCabecera.controls.idTimbrado.value}`)
    .append('nrofactura', `${this.formCabecera.controls.nroFactura.value}`)
    this.ventasSrv.get(httpParams).pipe(
      finalize(() => this.buscandoFactura = false)
    ).subscribe({
      next: (venta) => {
        if(venta.length > 0){
          this.idventa = `${venta[0].id}`;
          this.router.navigate(['../', venta[0].id ?? -1], { relativeTo: this.aroute });
          this.cargarDatosVenta(venta[0].id ?? -1);
        } else this.notif.create('warning', '<strong>No encontrado</strong>', `No se encontró ninguna factura con nro. ${this.formCabecera.controls.nroFactura.value}`);
      },
      error: (e) => {
        console.error('Error al cargar factura por nro', e);
        this.httpErrorHandler.process(e);
      }
    });
  }
}