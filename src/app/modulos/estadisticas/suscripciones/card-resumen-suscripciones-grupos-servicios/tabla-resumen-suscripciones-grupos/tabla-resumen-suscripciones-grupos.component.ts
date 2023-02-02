import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenGruposSuscripciones } from '@dto/resumen-grupos-suscripciones.dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tabla-resumen-suscripciones-grupos',
  templateUrl: './tabla-resumen-suscripciones-grupos.component.html',
  styleUrls: ['./tabla-resumen-suscripciones-grupos.component.scss']
})
export class TablaResumenSuscripcionesGruposComponent implements OnInit {

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

  lstResumenGrupos: ResumenGruposSuscripciones[] = [];
  loadingDatos: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 0;
  sortStr: string | null = '+grupo';

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private suscripcionesSrv: SuscripcionesService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loadingDatos = true;
    forkJoin({
      resumenGrupos: this.suscripcionesSrv.getResumenGrupos(this.getHttpQueryParams()),
      total: this.suscripcionesSrv.getTotalResumenGrupos(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstResumenGrupos = resp.resumenGrupos;
        this.totalRegisters = resp.total;
        this.loadingDatos = false;
      },
      error: (e) => {
        console.error('Error al cargar resumen por grupos de suscripciones', e);
        this.httpErrorHandler.process(e);
        this.loadingDatos = false;
      }
    })
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
  onQueryParamsChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

}
