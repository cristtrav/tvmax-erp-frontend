import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Cobrador } from './../../../dto/cobrador-dto';
import { CobradoresService } from './../../../servicios/cobradores.service';
import { Extra } from '../../../util/extra';
import { HttpParams } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { ServerResponseList } from '../../../dto/server-response-list.dto';


@Component({
  selector: 'app-vista-cobradores',
  templateUrl: './vista-cobradores.component.html',
  styleUrls: ['./vista-cobradores.component.scss']
})
export class VistaCobradoresComponent implements OnInit {

  lstCobradores: Cobrador[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 1;
  tableLoading: boolean = false;
  sortStr: string | null = '+id';

  constructor(
    private cobradoresSrv: CobradoresService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.tableLoading = true;
    this.cobradoresSrv.get(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<Cobrador>) =>{
      this.lstCobradores = resp.data;
      this.totalRegisters = resp.queryRowCount;      
      this.tableLoading = false;
    }, (e)=>{
      console.log('Error al cargar cobradores');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.tableLoading = false;
    });
  }

  eliminar(id: number | null): void {
    if(id !== null){
      this.cobradoresSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar cobrador');
        console.log(e);
        this.httpErrorHandler.handle(e);
        //this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  getHttpQueryParams(): HttpParams{
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    if(this.sortStr){
      params = params.append('sort', this.sortStr);
    }
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    return params;
  }

}
