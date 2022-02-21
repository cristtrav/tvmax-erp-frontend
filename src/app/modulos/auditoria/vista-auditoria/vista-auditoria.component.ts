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

  timerBusq: any;

  ideventoSelec: number | null = null;
  estadoAnteriorSelec: {[value: string]: string | number | boolean | null} | null = null;
  estadoNuevoSelec: {[value: string]: string | number | boolean | null} | null = null;
  modalDeteallesVisisble: boolean = false;

  constructor(
    private auditoriaSrv: AuditoriaService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }
  
  cargarDatos(){
    this.tableLoading = true;
    this.auditoriaSrv.getEventos(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<EventoAuditoria>)=>{
      this.lstEventos = resp.data;
      this.totalRegistros = resp.queryRowCount;
      this.tableLoading = false;
    }, (e)=>{
      console.log('Error al cargar eventos de auditoria');
      console.log((e));
      this.httpErrorHandler.handle(e);
      this.tableLoading = false;
    });
  }

  getHttpQueryParams(): HttpParams{
    let params: HttpParams = new HttpParams();
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex-1) * this.pageSize}`);
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

  verDetalles(
    idevento: number | null,
    ea: {[value: string]: string | number | boolean | null} | null = null,
    en: {[value: string]: string | number | boolean | null} | null = null
  ){
    this.estadoAnteriorSelec = ea;
    this.estadoNuevoSelec = en;
    this.ideventoSelec = idevento;
    this.modalDeteallesVisisble = true;
  }

  cerrarDetalles(){
    this.estadoAnteriorSelec = null;
    this.estadoNuevoSelec = null;
    this.ideventoSelec = null;
    this.modalDeteallesVisisble = false;
  }

}
