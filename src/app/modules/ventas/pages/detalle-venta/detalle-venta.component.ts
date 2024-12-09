import { Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
import { FacturaElectronicaUtilsService } from '@modules/ventas/services/factura-electronica-utils.service';
import { TimbradoUtilService } from '@modules/ventas/services/timbrado-util.service';
import { FormContactoClienteComponent } from '@modules/ventas/components/form-contacto-cliente/form-contacto-cliente.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SifenService } from '@services/facturacion/sifen.service';
import { NzValidateStatus } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss']
})
export class DetalleVentaComponent implements OnInit {

  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  @ViewChild('cuotasPendientes')
  cuotasPendientesComp!: CuotasPendientesComponent;

  @ViewChild(FormContactoClienteComponent)
  formContactoClienteComp!: FormContactoClienteComponent;

  guardandoContacto: boolean = false;

  idventa: string = 'nueva'
  lstTimbrados: Timbrado[] = [];
  lstClientes: Cliente[] = [];
  lstDetallesVenta: DetalleVenta[] = [];
  dvRuc: string | null = null;
  clienteSeleccionado?: Cliente;

  formCabecera: FormGroup = new FormGroup({
    nroFactura: new FormControl(null, [Validators.required]),
    idTimbrado: new FormControl(null, [Validators.required]),
    fecha: new FormControl(new Date(), Validators.required),
    idCliente: new FormControl(null, [Validators.required]),
    ci: new FormControl(null)
  });

  errorTipNroFactura: string = '';
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

  modalContactoVisible: boolean = false;
  facturaElectronica: boolean = false;

  //rucNoEncontrado: boolean = false;
  //consultandoRuc: boolean = false;

  mostrarValidacionRuc:boolean = false;
  estadoValidacionRuc: NzValidateStatus = 'success';

  timerBusquedaCliente: any;
  intervalFechaActual: any;

  usarFechaActual: boolean = true;

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private timbradoSrv: TimbradosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private clienteSrv: ClientesService,
    private ventasSrv: VentasService,
    private router: Router,
    private aroute: ActivatedRoute,
    private notif: NzNotificationService,
    private viewContainerRef: ViewContainerRef,
    public sesionSrv: SesionService,
    private impresionSrv: ImpresionService,
    private facturaElectronicaUtilsSrv: FacturaElectronicaUtilsService,
    private timbradoUtilSrv: TimbradoUtilService,
    private modal: NzModalService,
    private sifenSrv: SifenService
  ) { }

  ngOnInit(): void {
    this.idventa = this.aroute.snapshot.paramMap.get('idventa') ?? 'nueva';
    this.cargarTimbrados();
    this.formCabecera.get('idTimbrado')?.valueChanges.subscribe((value: number | null) => {
      this.timbradoUtilSrv.guardarUltimoSeleccionado(this.sesionSrv.idusuario, value);
      if(value == null){
        this.facturaElectronica = false;
        this.nroFacturaDesactivado = true;
        return;
      }
      
      this.timbradoSrv.getPorId(value).subscribe({
        next: (t) => {
          this.actualizarControlNroFactura(t);
          this.nroFacturaDesactivado = false;
          this.facturaElectronica = t.electronico ?? false;
        },
        error: (e) => {
          console.log('Error al cargar timbrado por id', e);
          this.httpErrorHandler.process(e);
        }
      });

      this.validarRuc();
    });

    this.formCabecera.get('nroFactura')?.valueChanges.subscribe((value: number | null) => {
      this.actualizarValidacionTimbrado();
    });

    this.formCabecera.get('idCliente')?.valueChanges.subscribe((value: number | null) => {
     
      const cliente = this.lstClientes.find(cliente => cliente.id == value);
      this.clienteSeleccionado = cliente;
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
      
      this.validarRuc();
      this.calcularTotalFactura();
    });

    if (this.idventa !== 'nueva') this.cargarDatosVenta(Number(this.idventa));

    this.formCabecera.get('idTimbrado')?.setValue(this.timbradoUtilSrv.obtenerUltimoSeleccionado(this.sesionSrv.idusuario));
    this.moduloActivadoDesde = this.router.routerState.snapshot.url.includes('pos') ? 'pos' : 'venta';
    if(this.idventa == 'nueva'){
      this.usarFechaActual = true;
      this.activarActualizacionFecha();
    }else this.usarFechaActual = false
  
  }

  cambiarAModoFechaActual(modoFechaActual: boolean){
    this.usarFechaActual = modoFechaActual;
    if(modoFechaActual){
      this.activarActualizacionFecha();
      this.formCabecera.controls.fecha.setValue(new Date());
    }
    else clearInterval(this.intervalFechaActual);
  }

  private activarActualizacionFecha(){
    clearInterval(this.intervalFechaActual);
    this.intervalFechaActual = setInterval(() => {      
      this.formCabecera.controls.fecha.setValue(new Date());
    }, 10000);
  }

  private validarRuc(){
    const idtimbrado = this.formCabecera.controls.idTimbrado.value;
    this.mostrarValidacionRuc = this.isRucValidated();
    if(!this.mostrarValidacionRuc){
      this.estadoValidacionRuc = 'success';
      return;
    }

    const timbrado = this.lstTimbrados.find(t => t.id == idtimbrado);
    if(timbrado == null || this.clienteSeleccionado == null){
      this.estadoValidacionRuc = 'success';
      return;
    };

    if(this.mostrarValidacionRuc && this.clienteSeleccionado && this.clienteSeleccionado.ci) this.consultarRuc(this.clienteSeleccionado.ci);
  }

  private isRucValidated(): boolean {
    const idtimbrado = this.formCabecera.controls.idTimbrado.value;
    if(idtimbrado == null || this.clienteSeleccionado == null) return false;

    const timbrado = this.lstTimbrados.find(t => t.id == idtimbrado);
    if(timbrado == null) return false;

    if(!timbrado.electronico) return false;
    if(timbrado.electronico && this.clienteSeleccionado.dvruc == null) return false;
    return true;
  }

  consultarRuc(ci: string){
    this.estadoValidacionRuc = 'validating';
    this.sifenSrv.consultarRuc(ci)
    .subscribe({
      next: (consulta) => {
        this.estadoValidacionRuc = 'success';
      },
      error: (e) => {
        console.log('Error al consultar', e);
        if(e.status == 404) this.estadoValidacionRuc = 'warning';
        else this.estadoValidacionRuc = 'success';
      }
    })
  }

  private agregarClienteALista(idcliente: number) {
    this.loadingClientes = true;
    this.clienteSrv.getPorId(idcliente)
    .pipe(finalize(() => this.loadingClientes = false))
    .subscribe({
      next: (cliente) => this.lstClientes = this.lstClientes.concat([cliente]),
      error: (e) => {
        console.error('Error al cargar clente seleccionado', e);
        this.httpErrorHandler.process(e);
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
        if(resp.venta.fechahorafactura) this.formCabecera.controls.fecha.setValue(new Date(resp.venta.fechahorafactura));
        else if (resp.venta.fechafactura) this.formCabecera.get('fecha')?.setValue(new Date(resp.venta.fechafactura));
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
    this.ventasSrv.post(this.getDtoFacturaVenta())
    .pipe(finalize(() => this.guardandoFactura = false))
    .subscribe({
      next: (idgenerado) => {
        this.idventa = `${idgenerado}`;
        this.router.navigate(['../', idgenerado], { relativeTo: this.aroute });
        this.notif.create('success', '<strong>Éxito</strong>', 'Factura registrada.');
        this.calcularTotalCuotasPendientes(this.formCabecera.controls.idCliente.value);
        clearInterval(this.intervalFechaActual);
      },
      error: (e) => {
        console.error('Error al registrar venta', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private editar(){
    this.guardandoFactura = true;
    this.ventasSrv.put(this.getDtoFacturaVenta())
    .pipe(finalize(() => this.guardandoFactura = false))
    .subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Venta editada');
        this.calcularTotalCuotasPendientes(this.formCabecera.controls.idCliente.value);
        this.cargarDatosVenta(Number(this.idventa));
      },
      error: (e) => {
        console.error('Error al editar venta', e);
        this.httpErrorHandler.process(e);        
      }
    });
  }

  buscarClienteDelayed(consulta: string){
    clearTimeout(this.timerBusquedaCliente);
    this.timerBusquedaCliente = setTimeout(() => {
      this.buscarCliente(consulta);
    }, 250);
  }

  buscarCliente(consulta: string) {
    this.lastSearchStrCli = consulta;
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('limit', '20');
    params = params.append('offset', '0');
    if (consulta) params = params.append('search', consulta);
    this.loadingClientes = true;
    this.clienteSrv.get(params)
    .pipe(finalize(() => this.loadingClientes = false))
    .subscribe({
      next: (clientes) => this.lstClientes = clientes,
      error: (e) => {
        console.error('Error al buscar cliente', e);
        this.httpErrorHandler.process(e);        
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
    this.clienteSrv.get(params)
    .pipe(finalize(() => this.loadingMasClientes = false))
    .subscribe({
      next: (clientes) => this.lstClientes = [...this.lstClientes, ...clientes],
      error: (e) => {
        console.error('Error al cargar mas clientes', e);
        this.httpErrorHandler.process(e);
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

  confirmarQuitarDetalleFactura(indice: number){
    const detalle = this.lstDetallesVenta[indice];
    this.modal.confirm({
      nzTitle: `¿Desea quitar el detalle?`,
      nzContent: `${detalle.descripcion} - Gs.${detalle.monto}`,
      nzOkText: `Quitar`,
      nzOkDanger: true,
      nzOnOk: () => this.quitarDetalleFactura(indice)
    })
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
    fv.fechafactura = formatDate(date, 'yyyy-MM-dd', this.locale);
    fv.fechahorafactura = date.toISOString();
    fv.idusuarioregistrocobro = this.sesionSrv.idusuario;
    const cliente = this.lstClientes.find(cliente => cliente.id == this.formCabecera.controls.idCliente.value);
    fv.idcobradorcomision = cliente?.idcobrador ?? null;
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
    this.cambiarAModoFechaActual(true);
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
    const timbrado = this.lstTimbrados.find(t => t.id == this.formCabecera.controls.idTimbrado.value)
    if(timbrado?.electronico){
      this.loadingImpresion = true;
      this.ventasSrv.getKUDE(Number(this.idventa))
      .pipe(finalize(() => this.loadingImpresion = false))
      .subscribe({
        next: (kude) => {
          const nombrearchivo = `${timbrado.prefijo}-${(this.formCabecera.controls.nroFactura.value).toString().padStart(7, '0')}`
          this.facturaElectronicaUtilsSrv.downloadKUDE(kude, nombrearchivo);
        },
        error: (e) => {
          this.notif.error(
            "<strong>Error al cargar KuDE</strong>",
            e.status == 404 ? 'Archivo no encontrado' : e
          )
          console.error('Error al cargar kude', e);
        }
      })
    }else{
      this.impresionSrv.imprimirFacturaPreimpresa( Number(this.idventa), this.iframe, this.viewContainerRef)
      .subscribe((loading) => this.loadingImpresion = loading);
    }
  }

  calcularTotalCuotasPendientes(idcliente: number) {
    this.loadingCantidadCuotas = true;
    let params = new HttpParams()
      .append('eliminado', 'false');
    this.clienteSrv.getSuscripcionesPorCliente(idcliente, params)
    .pipe(finalize(() => this.loadingCantidadCuotas = false))
    .subscribe({
      next: (suscripciones) => {
        let totalPendiente = 0
        suscripciones.forEach(suscripcion => totalPendiente += Number(suscripcion.cuotaspendientes));
        this.totalCuotasPendientes = totalPendiente;
      },
      error: (e) => {
        console.error('Error al consultar suscripciones por cliente', e);
      }
    })
  }

  buscarClientePorCi(event: any) {
    const ci = this.formCabecera.controls.ci.value;
    if (!ci) return;
    
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

  mostrarModalContacto(){
    this.modalContactoVisible = true;
  }

  ocultarModalContacto(){
    this.modalContactoVisible = false;
  }

  refreshClienteSeleccionado(){
    if(this.clienteSeleccionado == null || this.clienteSeleccionado.id == null) return;
    this.clienteSrv.getPorId(this.clienteSeleccionado.id).subscribe({
      next: (cliente) => {
        this.lstClientes = this.lstClientes.map(cli => {
          if(cli.id == cliente.id) return cliente;
          else return cli;
        });
        this.clienteSeleccionado = cliente;
      },
      error: (e) => {
        console.error(`Error al recargar cliente seleccionado: ${e.message}`);
      }
    })
  }
}