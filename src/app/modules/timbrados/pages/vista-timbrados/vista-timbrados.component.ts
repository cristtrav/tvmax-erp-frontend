import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TimbradosService } from '@services/timbrados.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Timbrado } from '@dto/timbrado.dto';

@Component({
  selector: 'app-vista-timbrados',
  templateUrl: './vista-timbrados.component.html',
  styleUrls: ['./vista-timbrados.component.scss']
})
export class VistaTimbradosComponent implements OnInit {

  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;
  sortStr: string | null = '+id';
  tableLoading: boolean = false;

  lstTimbrados: Timbrado[] = [];

  constructor(
    private timbradoSrv: TimbradosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  cargarDatos(){
    this.tableLoading = true;
    forkJoin({
      timbrados: this.timbradoSrv.get(this.getHttpParams()),
      total: this.timbradoSrv.getTotal(this.getHttpParams())
    }).subscribe({
      next: (resp) => {
        this.lstTimbrados = resp.timbrados;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar timbrados', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
      }
    });
  }

  getHttpParams(): HttpParams {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if(this.sortStr){
      params = params.append('sort', this.sortStr);
    }
    return params;
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  confirmarEliminacion(timbrado: Timbrado){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el Timbrado?',
      nzContent: `«Cód: ${timbrado.id} | Nro. timbrado: ${timbrado.nrotimbrado} | Rango: ${timbrado.nroinicio} al ${timbrado.nrofin}»`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(Number(timbrado.id));
      }
    })
  }

  eliminar(id: number){
    this.timbradoSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Timbrado eliminado correctamente');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar timbrado', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

}
