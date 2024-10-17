import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActividadEconomicaDTO } from '@dto/facturacion/actividad-economica.dto';
import { ActividadesEconomicasService } from '@services/facturacion/actividades-economicas.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vista-actividades-econimicas',
  templateUrl: './vista-actividades-econimicas.component.html',
  styleUrls: ['./vista-actividades-econimicas.component.scss']
})
export class VistaActividadesEconimicasComponent implements OnInit {

  loadingData: boolean = false;
  lstActividadesEconomicas: ActividadEconomicaDTO[] = [];

  constructor(
    private actividadesEconomicasSrv: ActividadesEconomicasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(){
    this.loadingData = true;
    const params = new HttpParams();
    this.actividadesEconomicasSrv.get(params)
    .pipe(finalize(() => this.loadingData = false))
    .subscribe({
      next: (actividades) => this.lstActividadesEconomicas = actividades,
      error: (e) => console.error('Error al consultar actividades economicas', e)
    })
  }

  public confirmarEliminacion(actividad: ActividadEconomicaDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar la Actividad Económica?',
      nzContent: `${actividad.id} - ${actividad.descripcion}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(actividad.id) 
    })
  }

  private eliminar(id: string){
    this.actividadesEconomicasSrv.delete(id)
    .subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Actividad económica eliminada');
        this.cargarDatos();
      },
      error: (e) =>  console.error('Error al eliminar actividad economica', id, e)
    })
  }

}
