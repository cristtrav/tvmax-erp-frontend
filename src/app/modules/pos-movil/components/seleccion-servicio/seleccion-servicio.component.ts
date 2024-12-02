import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { ServiciosService } from '@services/servicios.service';
import { SuscripcionesService } from '@services/suscripciones.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-seleccion-servicio',
  templateUrl: './seleccion-servicio.component.html',
  styleUrls: ['./seleccion-servicio.component.scss']
})
export class SeleccionServicioComponent implements OnInit {

  @Input()
  idcliente: number = -1;

  @Output()
  servicioChange = new EventEmitter<{servicio: Servicio, suscripcion: Suscripcion}>();

  lstServicios: Servicio[] = [];
  lstSuscripciones: Suscripcion[] = [];
  loadingServicios: boolean = false;
  servicioSeleccionado: Servicio | null = null;

  modalSeleccionSuscripcionVisible: boolean = false;

  constructor(
    private serviciosSrv: ServiciosService,
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}  

  ngOnInit(): void {
    this.cargarServicios();
  }
  
  cargarServicios(){
    const paramsServicios = new HttpParams()
    .append('eliminado', false)
    .append('suscribible', false)
    .append('sort', '+descripcion');

    const paramsSuscripciones = new HttpParams()
    .append('idcliente', this.idcliente)
    .append('eliminado', false);

    this.loadingServicios = true;
    forkJoin({
      suscripciones: this.suscripcionesSrv.get(paramsSuscripciones),
      servicios: this.serviciosSrv.getServicios(paramsServicios)
    })
    .pipe(finalize(() => this.loadingServicios = false))
    .subscribe({
      next: resp => {
        this.lstServicios = resp.servicios;
        this.lstSuscripciones = resp.suscripciones;
      },
      error: (e) => {
        console.error('Error al cargar servicios', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  seleccionarServicio(servicio: Servicio | null, suscripcion: Suscripcion){
    if(servicio) this.servicioChange.emit({servicio, suscripcion});
    this.cerrarModalSeleccionSuscripcion();
  }

  mostrarModalSeleccionSuscripcion(servicio: Servicio){
    this.servicioSeleccionado = servicio;
    this.modalSeleccionSuscripcionVisible = true;
  }

  cerrarModalSeleccionSuscripcion(){
    this.servicioSeleccionado = null;
    this.modalSeleccionSuscripcionVisible = false;
  }

}
