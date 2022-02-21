import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { EventoAuditoria } from '@dto/evento-auditoria-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { AuditoriaService } from '@servicios/auditoria.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-vista-auditoria',
  templateUrl: './vista-auditoria.component.html',
  styleUrls: ['./vista-auditoria.component.scss']
})
export class VistaAuditoriaComponent implements OnInit {

  @Input()
  set paramsFiltros(p: IParametroFiltro){
    console.log('params filtro cambio');
    const oldParams: string = JSON.stringify(this._paramsFiltros)
    this._paramsFiltros = p;
    if(oldParams !== JSON.stringify(p)) this.cargarDatos();
  }
  get paramsFiltros(): IParametroFiltro{
    return this._paramsFiltros;
  }
  private _paramsFiltros: IParametroFiltro = {};

  lstEventos: EventoAuditoria[] = [];
  totalRegistros: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortStr: string | null = '-fechahora'

  textoBusqueda: string = '';
  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;

  tableLoading: boolean = false;

  expandSet = new Set<number>();

  timerBusq: any;

  constructor(
    private auditoriaSrv: AuditoriaService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async cargarDatos(){
    this.tableLoading = true;
    try{
      const resp: ServerResponseList<EventoAuditoria> = await this.auditoriaSrv.getEventos(this.getHttpQueryParams()).toPromise();
      this.lstEventos = resp.data;
      this.totalRegistros = resp.queryRowCount;
      this.tableLoading = false;
    }catch(e){
      console.log('Error al cargar eventos de auditoria');
      console.log((e));
      this.httpErrorHandler.handle(e);
      this.tableLoading = false;
    }
  }

  getHttpQueryParams(): HttpParams{
    let params: HttpParams = new HttpParams();
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.appendAll(this.paramsFiltros);
    if(this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    return params;
  }

  onTableQueryParamsChange(p: NzTableQueryParams){
    this.pageIndex = p.pageIndex;
    this.pageSize = p.pageSize;
    this.sortStr = Extra.buildSortString(p.sort);
    this.cargarDatos();
  }

  objectToKeyValue(p: {[name: string]: string | number | null} | null): {key: string, value: string | number | null}[] {
    if(p) return Object.keys(p).map( k => {return { 'key': k, 'value': p[k]}});
    return [];
  }

  limpiarBusqueda(){
    this.textoBusqueda = "";
    this.cargarDatos();
  }

  buscar(){
    clearTimeout(this.timerBusq);
    this.timerBusq = setTimeout(() => {
      this.cargarDatos();
    }, 300);
  }

}
