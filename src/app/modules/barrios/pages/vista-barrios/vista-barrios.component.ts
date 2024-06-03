import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { forkJoin } from 'rxjs';
import { Barrio } from '@dto/barrio-dto';
import { BarriosService } from '@services/barrios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-vista-barrios',
  templateUrl: './vista-barrios.component.html',
  styleUrls: ['./vista-barrios.component.scss']
})
export class VistaBarriosComponent implements OnInit {

  lstBarrios: Barrio[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 1;
  tableLoading: boolean = false;
  sortStr: string | null = "+id";

  timerBusqueda: any;
  textoBusqueda: string = '';

  drawerFiltrosVisible: boolean = false;
  paramsFiltros: IParametroFiltro = {};
  cantFiltros: number = 0;

  constructor(
    private barrioSrv: BarriosService,
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
      barrios: this.barrioSrv.get(this.getHttpQueryParams()),
      total: this.barrioSrv.getTotalRegistros(this.getHttpQueryParams())
    }).subscribe({
      next: (respuesta) => {
        this.lstBarrios = respuesta.barrios;
        this.totalRegisters = respuesta.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar barrios', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
      }
    });
  }

  confirmarEliminacion(barrio: Barrio){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el barrio?',
      nzContent: `${barrio.id} - ${barrio.descripcion} (${barrio.departamento})`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => this.eliminar(barrio.id ?? -1)
    })
  }

  eliminar(id: number): void{
    this.barrioSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar barrios', e);      
        this.httpErrorHandler.process(e);
      }
    });
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize
    this.sortStr = this.getSortStr(params.sort);
    this.cargarDatos();
  }

  getHttpQueryParams(): HttpParams {
    var httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append('eliminado', 'false');
    if(this.sortStr){
      httpParams = httpParams.append('sort', this.sortStr);
    }
    httpParams = httpParams.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    httpParams = httpParams.append('limit', `${this.pageSize}`);
    if(this.textoBusqueda) httpParams = httpParams.append('search', this.textoBusqueda);
    httpParams = httpParams.appendAll(this.paramsFiltros);
    return httpParams;
  }

  getSortStr(sort: {key: string, value: any}[]): string | null {
    for(let s of sort){
      if(s.value === 'ascend') return `+${s.key}`;
      if(s.value === 'descend') return `-${s.key}`;
    }
    return null;
  }

  buscar(): void{
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(()=>{
      this.cargarDatos();
    }, 500)
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.cargarDatos();
  }

  filtrar(params: IParametroFiltro){
    this.paramsFiltros = params;
    this.cargarDatos();
  }

}
