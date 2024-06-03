import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { SuscripcionesService } from '@services/suscripciones.service';
import { switchMap, forkJoin, of } from 'rxjs';
import { Servicio } from '@dto/servicio-dto';
import { ServiciosService } from '@services/servicios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';

@Component({
  selector: 'app-contenido-vista-cuotas',
  templateUrl: './contenido-vista-cuotas.component.html',
  styleUrls: ['./contenido-vista-cuotas.component.scss']
})
export class ContenidoVistaCuotasComponent implements OnInit {

  @Input()
  idsuscripcion: number | null = null;
  lstServicios: Servicio[] = [];
  tabsLoading: boolean = false;
  idservicioSuscrito: number | null = null;

  constructor(
    private serviciosSrv: ServiciosService,
    private suscripcionSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void{
    this.tabsLoading = true;
    if(this.idsuscripcion){
      this.suscripcionSrv.getPorId(this.idsuscripcion).pipe(
        switchMap(suscr => forkJoin({
          suscripcion: of(suscr),
          servicios: this.serviciosSrv.getServiciosPorCuotasDeSuscripcion(this.idsuscripcion ?? -1, this.getHttpParams())
        }))
      )
      .subscribe({
        next: resp => {
          this.idservicioSuscrito = resp.suscripcion.idservicio;
          const listaServicios: Servicio[] = [];
          listaServicios.push(...resp.servicios.filter(srv => srv.id == resp.suscripcion.idservicio));
          listaServicios.push(...resp.servicios.filter(srv => srv.id != resp.suscripcion.idservicio));
          this.lstServicios = listaServicios;
          this.tabsLoading = false;
        },
        error: e => {
          console.error('Error al cargar servicios por cuota y suscripcion', e);
          this.httpErrorHandler.process(e);
          this.tabsLoading = false;
        }
      });
    }
  }

  getHttpParams(): HttpParams{
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    return params;
  }
}
