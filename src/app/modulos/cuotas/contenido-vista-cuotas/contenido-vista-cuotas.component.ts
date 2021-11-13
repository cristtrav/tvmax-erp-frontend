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
    private cuotaSrv: CuotasService,
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  private cargarServicios(): void{
    this.tabsLoading = true;
    if(this.idsuscripcion){
      this.serviciosSrv.getServiciosPorCuotasDeSuscripcion(this.idsuscripcion, this.getHttpParams()).subscribe((resp: ServerResponseList<Servicio>)=>{
        this.lstServicios = resp.data;
        this.tabsLoading = false;
      }, (e)=>{
        console.log('Error al cargar lista de servicios');
        console.log(e);
        //this.notif.create('error', 'Error al cargar lista de servicios', e.error);
        this.httpErrorHandler.handle(e);
        this.tabsLoading = false;
      });
    }
  }

  getHttpParams(): HttpParams{
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    return params;
  }
}
