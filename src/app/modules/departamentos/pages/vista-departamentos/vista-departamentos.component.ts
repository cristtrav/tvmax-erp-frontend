import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpParams } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin, Observable } from 'rxjs';
import { Departamento } from '@dto/departamento-dto';
import { DepartamentosService } from '@services/departamentos.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { Extra } from '@global-utils/extra';

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
  departamentosDataObs!: Observable<{departamentos: Departamento[], total: number}>;

  constructor(
    private depSrv: DepartamentosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  cargarDatos(): void{
    this.tableLoading = true;
    forkJoin({
      departamentos: this.depSrv.get(this.getRequestParams()),
      total: this.depSrv.getTotal(this.getRequestParams())
    })
    .pipe(finalize(() => this.tableLoading = false))
    .subscribe({
      next: (resp) =>{
        this.lstDepartamentos = resp.departamentos;
        this.totalRegisters = resp.total;
      }, 
      error: (e)=>{
        console.error('Error al cargar departamentos', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  eliminar(id: string | null): void {
    this.depSrv
      .delete(id)
      .subscribe({
        next: () => {
          this.notif.create('success', 'Eliminado correctamente', '');
          this.cargarDatos();
        },
        error: (e) => {
          console.error('Error al eliminar departamento', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  getRequestParams(): HttpParams {
    var params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    return params;
  }
}