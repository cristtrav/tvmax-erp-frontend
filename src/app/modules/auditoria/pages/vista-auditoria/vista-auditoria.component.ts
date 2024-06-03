import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { EventoAuditoria } from '@dto/evento-auditoria-dto';
import { AuditoriaService } from '@services/auditoria.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-auditoria',
  templateUrl: './vista-auditoria.component.html',
  styleUrls: ['./vista-auditoria.component.scss']
})
export class VistaAuditoriaComponent implements OnInit {

  @Input()
  set paramsFiltros(p: IParametroFiltro) {
    console.log('params filtro cambio');
    const oldParams: string = JSON.stringify(this._paramsFiltros)
    this._paramsFiltros = p;
    if (oldParams !== JSON.stringify(p)) this.cargarDatos();
  }
  get paramsFiltros(): IParametroFiltro {
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
  estadoAnteriorSelec: { [value: string]: string | number | boolean | null } | null = null;
  estadoNuevoSelec: { [value: string]: string | number | boolean | null } | null = null;
  modalDeteallesVisisble: boolean = false;

  constructor(
    private auditoriaSrv: AuditoriaService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.tableLoading = true;
    forkJoin({
      eventos: this.auditoriaSrv.getEventos(this.getHttpQueryParams()),
      total: this.auditoriaSrv.getTotalEventos(this.getHttpQueryParams())
    })
    .pipe(finalize(() => this.tableLoading = false))
    .subscribe({
      next: (resp) => {
        this.lstEventos = resp.eventos;
        this.totalRegistros = resp.total;
      },
      error: (e) => {
        console.error('Error al cargar eventos de auditoria', e);        
        this.httpErrorHandler.process(e);
      }
    });
  }

  getHttpQueryParams(): HttpParams {
    let params: HttpParams = new HttpParams();
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    if (this.sortStr) params = params.append('sort', this.sortStr);
    params = params.appendAll(this.paramsFiltros);
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    return params;
  }

  onTableQueryParamsChange(p: NzTableQueryParams) {
    this.pageIndex = p.pageIndex;
    this.pageSize = p.pageSize;
    this.sortStr = Extra.buildSortString(p.sort);
    this.cargarDatos();
  }

  limpiarBusqueda() {
    this.textoBusqueda = "";
    this.cargarDatos();
  }

  buscar() {
    clearTimeout(this.timerBusq);
    this.timerBusq = setTimeout(() => {
      this.cargarDatos();
    }, 300);
  }

  verDetalles(
    idevento: number | null,
    ea: { [value: string]: string | number | boolean | null } | null = null,
    en: { [value: string]: string | number | boolean | null } | null = null
  ) {
    this.estadoAnteriorSelec = ea;
    this.estadoNuevoSelec = en;
    this.ideventoSelec = idevento;
    this.modalDeteallesVisisble = true;
  }

  cerrarDetalles() {
    this.estadoAnteriorSelec = null;
    this.estadoNuevoSelec = null;
    this.ideventoSelec = null;
    this.modalDeteallesVisisble = false;
  }

}
