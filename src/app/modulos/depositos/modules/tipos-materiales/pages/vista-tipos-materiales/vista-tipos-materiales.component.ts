import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TipoMaterialDTO } from '@dto/depositos/tipo-material.dto';
import { TiposMaterialesService } from '@global-services/depositos/tipos-materiales.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-tipos-materiales',
  templateUrl: './vista-tipos-materiales.component.html',
  styleUrls: ['./vista-tipos-materiales.component.scss']
})
export class VistaTiposMaterialesComponent implements OnInit {

  lstTiposMateriales: TipoMaterialDTO[] = [];
  loadingtiposMateriales: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 0;
  sortStr: string | null = null;

  constructor(
    private tiposMaterialesSrv: TiposMaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    //this.cargarDatos();
  }

  cargarDatos(){
    this.loadingtiposMateriales = true;
    forkJoin({
      tiposmateriales: this.tiposMaterialesSrv.get(this.getHttpParams()),
      total: this.tiposMaterialesSrv.getCount()
    })
    .pipe(finalize(() => this.loadingtiposMateriales = false))
    .subscribe({
      next: (resp) => {
        this.lstTiposMateriales = resp.tiposmateriales;
        this.totalRegisters = resp.total;
      },
      error: (e) => {
        console.error('Error al consultar tipos de materiales', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private getHttpParams(): HttpParams{
    let params = new HttpParams()
    .append('eliminado', 'false')
    .append('limit', `${this.pageSize}`)
    .append('offset', `${this.pageSize * (this.pageIndex - 1)}`);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    return params;
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  confirmarEliminacion(tm: TipoMaterialDTO){
    this.modal.confirm({
      nzTitle: `¿Desea eliminar el Tipo de Material?`,
      nzContent: `${tm.id} - ${tm.descripcion}`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(tm.id);
      }
    })
  }

  eliminar(id: number){
    this.tiposMaterialesSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Tipo de material eliminado.');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar tipo de material');
        this.httpErrorHandler.process(e);
      }
    })
  }

}
