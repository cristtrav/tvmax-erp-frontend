import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { ClientesService } from '@services/clientes.service';
import { ServiciosService } from '@services/servicios.service';
import { SuscripcionesService } from '@services/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { finalize } from 'rxjs';

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
    this.serviciosSrv.getServicios(params)
    .pipe(finalize(() => this.loadingServicios = false))
    .subscribe({
      next: (servicios) => {
        const gruposMap = new Map<number, Grupo>();
        servicios.forEach(servicio => {
          gruposMap.set(servicio.idgrupo ?? -1, { id: servicio.idgrupo ?? -1, descripcion: servicio.grupo ?? '(sin grupo)' })
        });
        gruposMap.forEach(grupo => {
          this.mapGruposServicios.set(grupo.id ?? -1, servicios.filter(servi => servi.idgrupo == grupo.id))
        })
        this.lstGrupos = Array.from(gruposMap.values());
      },
      error: (e) => {
        console.error('Error al cargar servicios no suscribibles', e);
        this.httpErrorHandler.process(e);
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
