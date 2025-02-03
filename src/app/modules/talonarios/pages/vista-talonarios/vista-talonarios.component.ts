import { Component, OnInit, ViewChild } from '@angular/core';
import { TalonariosService } from '@services/facturacion/talonarios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TablaTalonariosComponent } from '@modules/talonarios/components/tabla-talonarios/tabla-talonarios.component';

@Component({
  selector: 'app-vista-talonarios',
  templateUrl: './vista-talonarios.component.html',
  styleUrls: ['./vista-talonarios.component.scss']
})
export class VistaTalonariosComponent implements OnInit {

  @ViewChild(TablaTalonariosComponent)
  tablaTalonariosComp!: TablaTalonariosComponent;

  /*pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;
  sortStr: string | null = '+id';
  tableLoading: boolean = false;

  lstTalonarios: Talonario[] = [];*/

  constructor(
    private talonariosSrv: TalonariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  /*cargarDatos(){
    this.tableLoading = true;
    forkJoin({
      talonarios: this.talonariosSrv.get(this.getHttpParams()),
      total: this.talonariosSrv.getTotal(this.getHttpParams())
    }).subscribe({
      next: (resp) => {
        this.lstTalonarios = resp.talonarios;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar talonarios', e);
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

  confirmarEliminacion(talonario: Talonario){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el Talonario?',
      nzContent: `«Cód: ${talonario.id} | Nro. timbrado: ${talonario.nrotimbrado} | Rango: ${talonario.nroinicio} al ${talonario.nrofin}»`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(Number(talonario.id));
      }
    })
  }

  eliminar(id: number){
    this.talonariosSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Talonario eliminado correctamente');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar talonario', e);
        this.httpErrorHandler.process(e);
      }
    });
  }*/

  recargar(){
    this.tablaTalonariosComp.cargarDatos();
  }

}
