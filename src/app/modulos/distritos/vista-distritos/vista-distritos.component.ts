import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Distrito } from './../../../dto/distrito-dto';
import { DistritosService } from './../../../servicios/distritos.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { NzTableQueryParams, NzTableSortOrder } from 'ng-zorro-antd/table';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-vista-distritos',
  templateUrl: './vista-distritos.component.html',
  styleUrls: ['./vista-distritos.component.scss']
})
export class VistaDistritosComponent implements OnInit {

  lstDist: Distrito[] = [];
  tableLoading: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 1;
  sortStr: string | null = "+id";

  constructor(
    private distSrv: DistritosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.tableLoading = true;
    this.distSrv.get(this.getHttpParams()).subscribe((data)=>{
      this.lstDist = data;
      this.tableLoading = false;
    }, (e)=>{
      console.log('Error al cargar distritos');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.tableLoading = false;
    });

    var paramCount: HttpParams = new HttpParams().append('eliminado', 'false');
    this.distSrv.getTotalRegistros(paramCount).subscribe((data)=>{
      this.totalRegisters = data;
    }, (e)=>{
      console.log('Error al consultar total de Distritos');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  eliminar(id: string | null) {
    if (id !== null) {
      this.distSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar distrito');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams){
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = this.getSortStr(params.sort);
    this.cargarDatos();
  }

  getHttpParams(): HttpParams{
    var params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if(this.sortStr){
      params = params.append('sort', this.sortStr);
    }
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    return params;
  }

  getSortStr( sort: {key: string, value: NzTableSortOrder}[]): string | null {
    for(let srt of sort){
      if(srt.value === 'ascend') return `+${srt.key}`;
      if(srt.value === 'descend') return `-${srt.key}`;
    }
    return null;
  }

}
