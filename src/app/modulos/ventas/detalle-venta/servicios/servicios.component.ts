import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { ClientesService } from '@servicios/clientes.service';
import { ServiciosService } from '@servicios/servicios.service';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {

  @Input()
  set idcliente(id: number | null){
    this._idcliente = id;
    if(id) this.cargarSuscripciones(id)
    else this.lstSuscripciones = [];
  }
  get idcliente(): number | null{
    return this._idcliente;
  }
  private _idcliente: number | null = null;

  @Output()
  agregarServicio = new EventEmitter<{servicio: Servicio, suscripcion: Suscripcion}>()

  lstGrupos: Grupo[] = [];
  lstSuscripciones: Suscripcion[] = [];
  mapGruposServicios: Map<number, Servicio[]> = new Map();
  loadingServicios: boolean = false;
  menuSuscripcionVisible: boolean = false;

  constructor(
    private serviciosSrv: ServiciosService,
    private suscripcionesSrv: SuscripcionesService,
    private clientesSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios() {
    this.loadingServicios = true;
    const params = new HttpParams()
      .append('eliminado', 'false')
      .append('suscribible', 'false');
    this.serviciosSrv.getServicios(params).subscribe({
      next: (servicios) => {
        let gruposTmp: Grupo[] = [];
        servicios.forEach(servicio => {
          if (!gruposTmp.find(grupo => grupo.id == servicio.idgrupo)) {
            gruposTmp.push({
              id: servicio.idgrupo ?? null,
              descripcion: servicio.grupo ?? null
            });
            this.mapGruposServicios.set(servicio.idgrupo ?? -1, servicios.filter(servicioFilter => servicioFilter.idgrupo === servicio.idgrupo))
          }
        })
        this.lstGrupos = gruposTmp;
        this.loadingServicios = false;
      },
      error: (e) => {
        console.error('Error al cargar servicios no suscribibles', e);
        this.httpErrorHandler.process(e);
        this.loadingServicios = false;
      }
    })
  }

  cargarSuscripciones(idcliente: number){
    const params = new HttpParams()
    .append('eliminado', 'false');
    this.clientesSrv.getSuscripcionesPorCliente(idcliente, params).subscribe({
      next: (suscripciones) => {
        this.lstSuscripciones = suscripciones;
      },
      error: (e) => {
        console.error('Error al cargar suscripciones por cliente', e);
      }
    })
  }

  agregarServicioEnDetalle(servicio: Servicio, suscripcion: Suscripcion){
    this.agregarServicio.emit({servicio, suscripcion});
  }

}
