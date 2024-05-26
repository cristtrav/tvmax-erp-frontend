import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Extra } from '@util/extra';
import { Distrito } from '@dto/distrito-dto';
import { DistritosService } from '@servicios/distritos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';

@Component({
  selector: 'app-vista-distritos',
  templateUrl: './vista-distritos.component.html',
  styleUrls: ['./vista-distritos.component.scss']
})
export class VistaDistritosComponent implements OnInit {

  lstDistritos: Distrito[] = [];
  tableLoading: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 1;
  sortStr: string | null = "+id";

  constructor(
    private distSrv: DistritosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  cargarDatos(): void {
    this.tableLoading = true;
    forkJoin({
      distritos: this.distSrv.get(this.getHttpParams()),
      count: this.distSrv.getTotalRegistros(this.getHttpParams())
    }).subscribe({
      next: (resp) => {
        this.lstDistritos = resp.distritos;
        this.totalRegisters = resp.count;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar distritos', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
      }
    });
  }
  
  confirmarEliminacion(distrito: Distrito){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el distrito?',
      nzContent: `${distrito.id} - ${distrito.descripcion} (${distrito.departamento})`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => this.eliminar(distrito.id) 
    });
  }

  eliminar(id: string | null) {
    if (id !== null) {
      this.distSrv.delete(id).subscribe({
        next: () => {
          this.notif.create('success', 'Eliminado correctamente', '');
        },
        error: (e) => {
          console.error('Error al eliminar distrito', e);
          this.httpErrorHandler.process(e);
        }
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  getHttpParams(): HttpParams {
    var params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if (this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    return params;
  }

}
