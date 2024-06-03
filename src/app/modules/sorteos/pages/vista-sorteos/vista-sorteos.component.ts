import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { SorteoDTO } from '@dto/sorteo.dto';
import { SorteosService } from '@services/sorteos.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-sorteos',
  templateUrl: './vista-sorteos.component.html',
  styleUrls: ['./vista-sorteos.component.scss']
})
export class VistaSorteosComponent {

  lstSorteos: SorteoDTO[] = [];
  totalRegisters: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  loadingSorteos: boolean = false;
  sortStr: string | null = null;

  constructor(
    private sorteosSrv: SorteosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  cargarDatos(){
    this.loadingSorteos = true;
    forkJoin({
      sorteos: this.sorteosSrv.get(this.getHttpParams()),
      total: this.sorteosSrv.getTotal(this.getHttpParams())
    })
    .pipe(
      finalize(() => this.loadingSorteos = false)
    )
    .subscribe({
      next: (resp) => {
        this.lstSorteos = resp.sorteos;
        this.totalRegisters = resp.total;
      },
      error: (e) => {
        console.error('Error al cargar sorteos', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  getHttpParams(): HttpParams{
    let params = new HttpParams()
    .append('eliminado', 'false')
    .append('limit', `${this.pageSize}`)
    .append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    return params;
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  confirmarEliminacion(sorteo: SorteoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el sorteo?',
      nzContent: `${sorteo.id} - ${sorteo.descripcion}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(sorteo.id)
    })
  }

  eliminar(id: number){
    this.sorteosSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', `<strong>Éxito</strong>`, 'Eliminado correctamente.');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar sorteo', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

}
