import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Servicio } from './../../../dto/servicio-dto';
import { CuotasService } from './../../../servicios/cuotas.service';
import { ServiciosService } from '../../../servicios/servicios.service';
import { ServerResponseList } from 'src/app/dto/server-response-list.dto';
import { HttpParams } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';

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

  constructor(
    private serviciosSrv: ServiciosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  private cargarServicios(): void{
    this.tabsLoading = true;
    if(this.idsuscripcion){
      this.serviciosSrv.getServiciosPorCuotasDeSuscripcion(this.idsuscripcion, this.getHttpParams()).subscribe({
        next: (servicios) => {
          this.lstServicios = servicios;
          this.tabsLoading = false;
        },
        error: (e) => {
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
