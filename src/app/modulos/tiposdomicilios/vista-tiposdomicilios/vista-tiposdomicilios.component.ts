import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TipoDomicilio } from './../../../dto/tipodomicilio-dto';
import { TiposdomiciliosService } from './../../../servicios/tiposdomicilios.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-vista-tiposdomicilios',
  templateUrl: './vista-tiposdomicilios.component.html',
  styleUrls: ['./vista-tiposdomicilios.component.scss']
})
export class VistaTiposdomiciliosComponent implements OnInit {

  lstTD: TipoDomicilio[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 1;
  tableLoading: boolean = false;
  sortStr: string | null = '+id';

  constructor(
    private tdSrv: TiposdomiciliosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.tableLoading = true;
    this.tdSrv.get(this.getHttpParamsQuery()).subscribe((data)=>{
      this.lstTD = data;
      this.tableLoading = false;
    }, (e)=>{
      this.tableLoading = false;
      console.log('Error al cargar tipos de domicilios');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
    var parCount: HttpParams = new HttpParams().append('eliminado', 'false');
    this.tdSrv.getTotalRegistros(parCount).subscribe((data)=>{
      this.totalRegisters = data;
    },(e)=>{
      console.log('Error al consultar total de tipos de domicilios');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  eliminar(id: number | null): void {
    if(id!==null){
      this.tdSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al elliminar tipo de domicilio');
        console.log(e);
        this.httpErrorHandler.handle(e);        
      });
    }
  }

  getHttpParamsQuery(): HttpParams {
    var par: HttpParams = new HttpParams().append('eliminado', 'false');
    par = par.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    par = par.append('limit', `${this.pageSize}`);
    if(this.sortStr){
      par = par.append('sort', this.sortStr);
    }
    return par;
  }

  onTableQueryParamChange(p: NzTableQueryParams){
    this.pageIndex = p.pageIndex;
    this.pageSize = p.pageSize;
    this.sortStr = this.getSortStr(p.sort);
    this.cargarDatos();
  }

  getSortStr(sort: {key: string, value: any}[]): string | null {
    for(let s of sort){
      if(s.value === 'ascend') return `+${s.key}`;
      if(s.value === 'descend') return `-${s.key}`;
    }
    return null;
  }

}
