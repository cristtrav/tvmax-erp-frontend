import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CuotaDTO } from '@dto/cuota-dto';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { ClientesService } from '@global-services/clientes.service';
import { CuotasService } from '@global-services/cuotas.service';
import { ServiciosService } from '@global-services/servicios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';

@Component({
  selector: 'app-cuotas-pendientes',
  templateUrl: './cuotas-pendientes.component.html',
  styleUrls: ['./cuotas-pendientes.component.scss']
})
export class CuotasPendientesComponent implements OnInit {

  @Input()
  set idcliente(id: number | null) {
    this._idcliente = id;
    this.cargarSuscripciones(id);
  }
  get idcliente(): number | null {
    return this._idcliente;
  }
  private _idcliente: number | null = null;

  @Output()
  cantidadCuotasPendientes = new EventEmitter<number>();

  @Output()
  agregarCuota = new EventEmitter<CuotaDTO>()

  @Output()
  quitarCuota = new EventEmitter<CuotaDTO>()

  lstSuscripciones: Suscripcion[] = [];
  loadingSuscripciones: boolean = false;
  montoTotalPendiente: number = 0;

  expandSet = new Set<number>();
  mapSuscripcionesServicios: Map<number, Servicio[]> = new Map();
  mapSuscripcionesServiciosCuotas: Map<string, CuotaDTO[]> = new Map();

  mapLoadingServicios: Map<number, boolean> = new Map();
  mapLoadingCuotas: Map<string, boolean> = new Map();

  @Input()
  mapCuotasEnDetalle: Map<number, boolean> = new Map();

  constructor(
    private clientesSrv: ClientesService,
    private serviciosSrv: ServiciosService,
    private cuotasSrv: CuotasService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
      this.cargarServicios(id);
    }
    else this.expandSet.delete(id);
  }

  cargarSuscripciones(idcliente: number | null) {
    if (idcliente) {
      this.loadingSuscripciones = true;
      let params: HttpParams = new HttpParams();
      params = params.append('eliminado', 'false');
      this.clientesSrv.getSuscripcionesPorCliente(idcliente, params).subscribe({
        next: (suscripciones) => {          
          let cantCuotas = 0;
          let deudaTotal = 0;
          suscripciones.forEach(suscripcion => {
            cantCuotas += Number(suscripcion.cuotaspendientes);
            deudaTotal += Number(suscripcion.deuda);
          });
          this.cantidadCuotasPendientes.emit(cantCuotas);
          this.montoTotalPendiente = deudaTotal;
          this.lstSuscripciones = suscripciones;
          this.loadingSuscripciones = false;
        },
        error: (e) => {
          console.error('Error al cargar suscripciones por cliente', e);
          this.httpErrorHandler.process(e);
          this.loadingSuscripciones = false;
        }
      });      
    } else {
      this.lstSuscripciones = [];
      this.mapSuscripcionesServicios.clear()
      this.mapSuscripcionesServiciosCuotas.clear();
    }
  }

  cargarServicios(idsuscripcion: number) {
    this.mapLoadingServicios.set(idsuscripcion, true);
    let paramsServicios: HttpParams = new HttpParams();
    paramsServicios = paramsServicios.append('eliminado', 'false');
    paramsServicios = paramsServicios.append('pagado', 'false');
    this.serviciosSrv.getServiciosPorCuotasDeSuscripcion(idsuscripcion, paramsServicios).subscribe({
      next: (servicios) => {
        this.mapSuscripcionesServicios.set(idsuscripcion, servicios);
        servicios.forEach(servicio => this.cargarCuotasPendientes(idsuscripcion, servicio.id ?? -1));
        this.mapLoadingServicios.set(idsuscripcion, false);
      },
      error: (e) => {
        console.error('Error al cargar servicios por cuotas y suscripcion', e);
        this.httpErrorHandler.process(e);
        this.mapLoadingServicios.set(idsuscripcion, false);
      }
    });
  }

  cargarCuotasPendientes(idsuscripcion: number, idservicio: number) {
    this.mapLoadingCuotas.set(`${idsuscripcion}-${idservicio}`, true);
    let paramsCuotas: HttpParams = new HttpParams();
    paramsCuotas = paramsCuotas.append('eliminado', 'false');
    paramsCuotas = paramsCuotas.append('pagado', 'false');
    paramsCuotas = paramsCuotas.append('sort', '-fechavencimiento');
    paramsCuotas = paramsCuotas.append('idsuscripcion', `${idsuscripcion}`);
    paramsCuotas = paramsCuotas.append('idservicio', `${idservicio}`);
    
    this.cuotasSrv.get(paramsCuotas).subscribe({
      next: (cuotas) => {
        this.mapSuscripcionesServiciosCuotas.set(`${idsuscripcion}-${idservicio}`, cuotas);
        this.mapLoadingCuotas.set(`${idsuscripcion}-${idservicio}`, false);
      },
      error: (e) => {
        console.error(`Error al cargar las cuotas del servicio`, e);
        this.httpErrorHandler.process(e);
        this.mapLoadingCuotas.set(`${idsuscripcion}-${idservicio}`, false);
      }
    });
  }

  refresh(){
    this.cargarSuscripciones(this.idcliente);
  }

  agregarCuotaEnDetalle(cuota: CuotaDTO){
    this.agregarCuota.emit(cuota);
  }

  quitarCuotaDeDetalle(cuota: CuotaDTO){
    this.quitarCuota.emit(cuota);
  }
}