import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TimbradosService } from '@servicios/timbrados.service';
import { Timbrado } from '@dto/timbrado.dto';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Extra } from '@util/extra';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(){
    this.tableLoading = true;
    this.timbradoSrv.get(this.getHttpParams()).subscribe((resp: ServerResponseList<Timbrado>)=>{
      this.lstTimbrados = resp.data;
      this.totalRegisters = resp.queryRowCount;
      this.tableLoading = false;
    },
    (e)=>{
      console.log('Error al cargar timbrado');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.tableLoading = false;
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

  eliminar(id: number | null){
    if(id){
      this.timbradoSrv.delete(id).subscribe(()=>{
        this.notif.create('success', '<strong>Éxito</strong>', 'Timbrado eliminado correctamente');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar timbrado');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
    
  }

}
