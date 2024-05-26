import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenEstadosSuscripciones } from '@dto/resumen-estados-suscripciones.dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-card-resumen-estados',
  templateUrl: './card-resumen-estados.component.html',
  styleUrls: ['./card-resumen-estados.component.scss']
})
export class CardResumenEstadosComponent implements OnInit {

  @Input()
  get paramsFiltros(): IParametroFiltro { return this._paramsFiltros };
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = { ...p };
    if (oldParams !== JSON.stringify(p)) this.cargarDatos();;
  };
  private _paramsFiltros: IParametroFiltro = {};

  @Input()
  get textoBusqueda(): string { return this._textoBusqueda };
  set textoBusqueda(t: string) {
    const oldSearch: string = this._textoBusqueda;
    this._textoBusqueda = t;
    if (oldSearch !== t) {
      clearTimeout(this.timerBusqueda);
      this.timerBusqueda = setTimeout(() => {
        this.cargarDatos();
      }, 500);
    }
  }
  private _textoBusqueda: string = '';
  private timerBusqueda: any;

  lstResumenEstados: ResumenEstadosSuscripciones[] = [];
  tableLoading: boolean = false;
  totalRegisters: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  sortStr: string | null = null;

  constructor(
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private getHttpQueryParams(): HttpParams {
    let params: HttpParams = new HttpParams().appendAll(this.paramsFiltros);
    params = params.append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    if (this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`)
    return params;
  }

  cargarDatos() {
    this.tableLoading = true;
    forkJoin({
      resumenEstados: this.suscripcionesSrv.getResumenEstados(this.getHttpQueryParams()),
      total: this.suscripcionesSrv.getTotalResumenEstados(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstResumenEstados = resp.resumenEstados;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar resumenes de estados de suscripciones', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

}
