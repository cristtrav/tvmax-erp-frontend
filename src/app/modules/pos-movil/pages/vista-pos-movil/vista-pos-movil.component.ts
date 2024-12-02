import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { CuotaDTO } from '@dto/cuota-dto';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { CuotasService } from '@services/cuotas.service';
import { SuscripcionesService } from '@services/suscripciones.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize, from, map, mergeMap, toArray } from 'rxjs';
import { formatDate } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { Venta } from '@dto/venta.dto';
import { SesionService } from '@services/sesion.service';
import { VentasService } from '@services/ventas.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { FormContactoClienteComponent } from '@modules/ventas/components/form-contacto-cliente/form-contacto-cliente.component';
import { ClientesService } from '@services/clientes.service';
import { PasoClienteComponent } from '@modules/pos-movil/components/paso-cliente/paso-cliente.component';

@Component({
  selector: 'app-vista-pos-movil',
  templateUrl: './vista-pos-movil.component.html',
  styleUrls: ['./vista-pos-movil.component.scss']
})
export class VistaPosMovilComponent {

  @ViewChild(FormContactoClienteComponent)
  formContactoClienteComp!: FormContactoClienteComponent;

  @ViewChild(PasoClienteComponent)
  pasoClienteComp!: PasoClienteComponent;

  clienteSeleccionado: Cliente | null = null;
  pasoActual = 0;

  pasoSiguienteActivado: boolean = false;
  pasoAnteriorActivado: boolean = false;

  modalCuotasVisible: boolean = false;
  modalServiciosVisible: boolean = false;
  nroCuotas: number = 1;
  
  cuotasEnDetalle: number[] = [];
  lstDetalles: DetalleVenta[] = [];

  totalVenta: number = 0;
  totalGravado10: number = 0;
  totalGravado5: number = 0;
  totalIva10: number = 0;
  totalIva5: number = 0;
  totalExento: number = 0;

  fechaFactura: Date | null = null;
  idtimbrado: number | null = null

  guardando: boolean = false;

  modalContactoVisible: boolean = false;
  guardandoContacto: boolean = false;

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private modal: NzModalService,
    private cuotasSrv: CuotasService,
    private suscripcionesSrv: SuscripcionesService,
    private clienteSrv: ClientesService,
    private message: NzMessageService,
    public sesionSrv: SesionService,
    private ventasSrv: VentasService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
  ){}

  cargarNroCuotas(idcliente: number){
    const paramsSusc = new HttpParams()
    .append('idcliente', idcliente)
    .append('eliminado', false);

    const paramsCuotas = new HttpParams()
    .append('eliminado', false)
    .append('pagado', false);

    this.suscripcionesSrv
    .get(paramsSusc)
    .pipe(
      mergeMap(suscripciones => 
        from(suscripciones).pipe(
          mergeMap(suscripcion => 
            this.cuotasSrv.getCuotasPorSuscripcion(suscripcion.id ?? -1, paramsCuotas)
          ),
          toArray()
        ),
      ),
      map(cuotas => cuotas.flat().length)
    )
    .subscribe({
      next: (nroCuotas) => this.nroCuotas = nroCuotas,
      error: (e) => console.error('Error al consultar cuotas pendientes', e)
    })
    
  }

  private evaluarPasos(){
    this.pasoAnteriorActivado = this.evaluarPasoAnterior();
    this.pasoSiguienteActivado = this.evaluarPasoSiguiente();
  }

  private evaluarPasoAnterior(): boolean {
    if(this.pasoActual == 0) return false;
    if(this.pasoActual >= 3) return false;
    return true;
  }

  private evaluarPasoSiguiente(): boolean {
    if(this.pasoActual == 0 && this.clienteSeleccionado == null) return false;
    if(this.pasoActual == 1 && this.lstDetalles.length == 0) return false;
    if(this.pasoActual >= 2 ) return false;
    return true;
  }

  siguiente(){
    this.pasoActual++;
    this.evaluarPasos();
  }

  anterior(){
    this.pasoActual--;
    this.evaluarPasos();
  }

  seleccionarCliente(cliente: Cliente | null){
    this.clienteSeleccionado = cliente;
    this.lstDetalles = [];
    if(cliente != null) this.cargarNroCuotas(cliente.id ?? -1);
    else this.nroCuotas = 0;
    this.evaluarPasos();
    this.calcularTotales();
  }

  private limpiarCliente(){
    this.clienteSeleccionado = null;
    this.lstDetalles = [];
    this.nroCuotas = 0;
    this.evaluarPasos();
  }

  private limpiarDetalles(){
    this.nroCuotas = this.nroCuotas + this.cuotasEnDetalle.length;
    this.lstDetalles = [];
    this.evaluarPasos();
    this.cuotasEnDetalle = [];
    this.calcularTotales();
  }

  confirmarLimpiarCliente(){
    this.modal.confirm({
      nzTitle: 'Limpiar formulario',
      nzContent: '¿Desea limpiar el cliente seleccionado?',
      nzOkText: 'Limpiar',
      nzOnOk: () => this.limpiarCliente()
    })
  }

  confirmarLimpiarDetalles(){
    this.modal.confirm({
      nzTitle: 'Limpiar items',
      nzContent: '¿Desea quitar todo los items?',
      nzOkText: 'Limpiar',
      nzOnOk: () => this.limpiarDetalles()
    })
  }

  mostrarModalCuotas(){
    this.modalCuotasVisible = true;
  }

  cerrarModalCuotas(){
    this.modalCuotasVisible = false;
  }

  mostrarModalServicios(){
    this.modalServiciosVisible = true;
  }

  cerrarModalServicios(){
    this.modalServiciosVisible = false;
  }

  agregarCuotaDetalle(cuota: CuotaDTO){
    const detalle = new DetalleVenta();
    detalle.cantidad = 1;
    detalle.idcuota = cuota.id ?? -1;
    detalle.eliminado = false;
    detalle.idservicio = cuota.idservicio ?? -1;
    detalle.idsuscripcion = cuota.idsuscripcion ?? -1;
    detalle.monto = cuota.monto ?? 0;
    detalle.subtotal = detalle.monto * detalle.cantidad;
    detalle.porcentajeiva = cuota.porcentajeiva ?? 10;
    detalle.montoiva = Math.round((detalle.subtotal * detalle.porcentajeiva) / (100 + detalle.porcentajeiva));
    const fechaVencimiento = cuota.fechavencimiento ? formatDate(cuota.fechavencimiento, 'MMM yyyy', this.locale) : '';
    detalle.descripcion = `CUOTA ${fechaVencimiento} | ${cuota.servicio} [${cuota.idsuscripcion}]`.toUpperCase();
    
    this.lstDetalles = this.lstDetalles.concat([detalle]);
    this.cuotasEnDetalle = this.cuotasEnDetalle.concat([cuota.id ?? -1]);
    this.nroCuotas--;
    this.message.success('Cuota agregada');
    this.evaluarPasos();
    this.calcularTotales();
  }

  agregarServicioDetalle(seleccion: {servicio: Servicio, suscripcion: Suscripcion}){
    const detalle = new DetalleVenta();
    detalle.cantidad = 1;
    detalle.eliminado = false;
    detalle.idservicio = seleccion.servicio.id ?? -1;
    detalle.idsuscripcion = seleccion.suscripcion.id;
    detalle.monto = seleccion.servicio.precio ?? 0;
    detalle.subtotal = detalle.cantidad * detalle.monto;
    detalle.porcentajeiva = seleccion.servicio.porcentajeiva ?? 10;
    detalle.montoiva = Math.round((detalle.subtotal * detalle.porcentajeiva) / (100 + detalle.porcentajeiva));
    detalle.descripcion = `${seleccion.servicio.descripcion} | ${seleccion.suscripcion.servicio} [${seleccion.suscripcion.id}]`.toUpperCase();
    this.lstDetalles = this.lstDetalles.concat([detalle]);
    this.message.success('Servicio agregado');
    this.evaluarPasos();
    this.calcularTotales();
  }

  quitarDetalle(index: number){
    if(this.lstDetalles[index].idcuota != null){
      this.nroCuotas++;
      this.cuotasEnDetalle = this.cuotasEnDetalle.filter(id => id != this.lstDetalles[index].idcuota);
    }
    this.lstDetalles = this.lstDetalles.filter((detalle, i) => i != index);
    this.evaluarPasos();
    this.calcularTotales();
  }

  calcularTotales(){
    this.totalVenta = 0;
    this.totalIva5 = 0;
    this.totalIva10 = 0;
    this.totalGravado10 = 0;
    this.totalGravado5 = 0;
    this.totalExento = 0;
    for (let dfv of this.lstDetalles) {
      this.totalVenta += Number(dfv.subtotal) ?? 0;
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

  getDto(): Venta{
    const venta = new Venta();
    venta.total = this.totalVenta;
    venta.totaliva10 = this.totalIva10;
    venta.totaliva5 = this.totalIva5;
    venta.totalgravadoiva10 = this.totalGravado10;
    venta.totalgravadoiva5 = this.totalGravado5;
    venta.totalexentoiva = this.totalExento;
    venta.detalles = this.lstDetalles;
    venta.idtimbrado = this.idtimbrado;
    //venta.nrofactura = this.formCabecera.get('nroFactura')?.value;
    venta.pagado = true;
    venta.idcliente = this.clienteSeleccionado?.id ?? -1;
    const date: Date = this.fechaFactura ?? new Date();
    const fechaSinHora: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    venta.fechacobro = fechaSinHora;
    venta.fechafactura = fechaSinHora;
    venta.idusuarioregistrocobro = this.sesionSrv.idusuario;
    venta.idcobradorcomision = this.clienteSeleccionado?.idcobrador ?? null;
    venta.idusuarioregistrofactura = this.sesionSrv.idusuario;
    return venta;
  }

  registrar(){
    this.guardando = true;
    this.ventasSrv.post(this.getDto())
    .pipe(finalize(() => this.guardando = false))
    .subscribe({
      next: (id) => {
        this.notif.success('<strong>Éxito</strong>', 'Factura guardada');
        this.siguiente();
      },
      error: (e) => {
        console.error('Error al registrar venta', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  nuevo(){
    this.pasoActual = 0;
    this.limpiarCliente();
  }

  mostrarModalContacto(){
    this.modalContactoVisible = true;
  }

  ocultarModalContacto(){
    this.modalContactoVisible = false;
  }

  /*refreshClienteSeleccionado(){
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
  }*/

}
