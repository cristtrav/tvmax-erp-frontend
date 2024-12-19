import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { ClientesService } from '@services/clientes.service';
import { ServiciosService } from '@services/servicios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit, AfterViewInit {

  @ViewChild('inputBusqueda')
  inputBusquedaElement?: ElementRef<HTMLInputElement>;

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
  agregarServicio = new EventEmitter<{servicio: Servicio, suscripcion?: Suscripcion}>()

  lstGrupos: Grupo[] = [];
  loadingGrupos: boolean = false;
  lstServicios: Servicio[] = [];
  lstSuscripciones: Suscripcion[] = [];
  //mapGruposServicios: Map<number, Servicio[]> = new Map();
  loadingServicios: boolean = false;
  menuSuscripcionVisible: boolean = false;

  modalSuscripcionesVisible: boolean = false;
  idservicioSeleccionado?: number;

  idgrupoFiltro?: number;
  textoBusqueda: string = ''; 
  timerBusqueda?: NodeJS.Timeout;

  constructor(
    private serviciosSrv: ServiciosService,    
    private clientesSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inputBusquedaElement?.nativeElement.focus();  
    }, 250);
  }

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarGrupos();
  }

  cargarGrupos(){
    this.loadingGrupos = true;
    const params = new HttpParams()
      .append('eliminado', false)
      .append('suscribible', false);
    this.serviciosSrv.getServicios(params)
    .pipe(finalize(() => this.loadingGrupos = false))
    .subscribe({
      next: (servicios) => {
        const gruposMap = new Map<number, Grupo>();
        servicios.forEach(servicio => {
          gruposMap.set(servicio.idgrupo ?? -1, { id: servicio.idgrupo ?? -1, descripcion: servicio.grupo ?? '(sin grupo)' })
        });
        this.lstGrupos = Array.from(gruposMap.values());
      },
      error: (e) => {
        console.error('Error al cargar grupos', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  cargarServicios() {
    this.loadingServicios = true;
    this.serviciosSrv.getServicios(this.getHttpParams())
    .pipe(finalize(() => this.loadingServicios = false))
    .subscribe({
      next: (servicios) => {
        this.lstServicios = servicios;
      },
      error: (e) => {
        console.error('Error al cargar servicios no suscribibles', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private getHttpParams(): HttpParams{
    let params = new HttpParams()
      .append('eliminado', 'false')
      .append('suscribible', 'false');
    if(this.idgrupoFiltro != null) params = params.append('idgrupo', this.idgrupoFiltro);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
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

  agregarServicioEnDetalle(servicio: Servicio, suscripcion?: Suscripcion){
    this.agregarServicio.emit({servicio, suscripcion});
  }

  mostrarModalSuscripciones(idservicio: number){
    this.idservicioSeleccionado = idservicio;
   //this.suscripcionOpcionalServSelecc = suscripcionOpcional;
    this.modalSuscripcionesVisible = true;
  }

  cerrarModalSuscripciones(){
    this.idservicioSeleccionado = undefined;
    this.modalSuscripcionesVisible = false;
  }

  seleccionarSuscripcion(idsuscripcion?: number){
    let suscripcion: Suscripcion | null | undefined;
    if(idsuscripcion != null) suscripcion = this.lstSuscripciones.find(s => s.id == idsuscripcion);
    const servicio = this.lstServicios.find(s => s.id == this.idservicioSeleccionado);
    if(servicio == null){
      console.error('Servicio no encontrado', servicio);
    }else{
      this.agregarServicio.emit({servicio , suscripcion: suscripcion ?? undefined});
    }
    this.cerrarModalSuscripciones();
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarServicios();
    }, 300);
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.cargarServicios();
  }

}
