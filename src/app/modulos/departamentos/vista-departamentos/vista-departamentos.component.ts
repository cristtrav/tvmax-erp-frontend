import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Departamento } from './../../../dto/departamento-dto';
import { DepartamentosService } from './../../../servicios/departamentos.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { HttpParams } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-departamentos',
  templateUrl: './vista-departamentos.component.html',
  styleUrls: ['./vista-departamentos.component.scss']
})
export class VistaDepartamentosComponent implements OnInit {

  lstDepartamentos: Departamento[] = [];
  totalRegisters: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;
  sortStr: string | null = "+id"
  tableLoading: boolean = false;

  constructor(
    private depSrv: DepartamentosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void{
    this.tableLoading = true;
    forkJoin({
      departamentos: this.depSrv.get(this.getRequestParams()),
      total: this.depSrv.getTotal(this.getRequestParams())
    }).subscribe({
      next: (resp) =>{
        this.lstDepartamentos = resp.departamentos;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      }, 
      error: (e)=>{
        this.tableLoading = false;
        console.log('Error al cargar departamentos');
        console.log(e);
        this.httpErrorHandler.process(e);
      }
    });

    /*this.depSrv.get(this.getRequestParams()).subscribe((resp: ServerResponseList<Departamento>)=>{
      this.lstDepartamentos = resp.data;
      this.totalRegisters = resp.queryRowCount;
      this.tableLoading = false;
    }, (e)=>{
      this.tableLoading = false;
      console.log('Error al cargar departamentos');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });*/
  }

  eliminar(id: string | null): void {
    this.depSrv.delete(id).subscribe(()=>{
      this.notif.create('success', 'Eliminado correctamente', '');
      this.cargarDatos();
    }, (e)=>{
      console.log('Error al eliminar departamento');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    this.sortStr = this.getSortStr(params.sort);
    this.cargarDatos();
  }

  getSortStr(sortArray: {key: string, value: any}[]): string | null{
    for(let srt of sortArray){
      if(srt.value === 'ascend') return `+${srt.key}`;
      if(srt.value === 'descend') return `-${srt.key}`;
    }
    return null;
  }

  getRequestParams(): HttpParams {
    var params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if(this.sortStr){
      params = params.append('sort', this.sortStr);
    }
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    return params;
  }
}