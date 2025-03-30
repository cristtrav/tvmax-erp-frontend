import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AjusteExistenciaDTO } from '@dto/depositos/ajuste-existencia.dto';
import { AjustesExistenciasService } from '@services/depositos/ajustes-existencias.service';
import { MaterialesService } from '@services/depositos/materiales.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-tabla-ajustes-existencias',
  templateUrl: './tabla-ajustes-existencias.component.html',
  styleUrls: ['./tabla-ajustes-existencias.component.scss']
})
export class TablaAjustesExistenciasComponent implements OnInit {

  @Input()
  idmaterial?: number;

  @Output()
  ajusteEliminado = new EventEmitter<boolean>();

  lstAjustesExistencias: AjusteExistenciaDTO[] = [];
  totalRegisters: number = 0;
  sortStr: string | null = '-id';
  loading: boolean = false;
  mapEliminando = new Map<number, boolean>();

  constructor(
    private ajustesExistenciasSrv: AjustesExistenciasService,
    private materialesSrv: MaterialesService,
    private modal: NzModalService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(){
    this.loading = true;
    forkJoin({
      ajustes: this.ajustesExistenciasSrv.get(this.getHttpParams()),
      total: this.ajustesExistenciasSrv.getTotal(this.getHttpParams())
    })
    .pipe(finalize(() => this.loading = false))
    .subscribe((resp) => {
      this.lstAjustesExistencias = resp.ajustes;
      this.totalRegisters = resp.total;
    })
  }

  private getHttpParams(): HttpParams{
    let params = new HttpParams().append('eliminado', false);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    if(this.idmaterial != null) params = params.append('idmaterial', this.idmaterial);
    return params;
  }

  confirmarEliminacion(ajuste: AjusteExistenciaDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el ajuste de existencia?',
      nzContent: `${ajuste.id} - ${ajuste.material} | Cantidad: ${ajuste.cantidadnueva} ${ajuste.unidadmedida}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(ajuste.id ?? -1)
    })
  }

  eliminar(id: number){
    this.mapEliminando.set(id, true);
    this.ajustesExistenciasSrv
      .delete(id)
      .pipe(finalize(() => this.mapEliminando.set(id, false)))
      .subscribe(() => {
        this.notif.success('<strong>Éxito</strong>', 'Ajuste de existencia eliminiado');
        this.ajusteEliminado.emit(true);
        this.cargarDatos();
      });
  }

}
