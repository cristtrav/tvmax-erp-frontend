import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenDepartamentosSuscripciones } from '@dto/resumen-departamentos-suscripciones.dto';
import { SuscripcionesService } from '@services/suscripciones.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tabla-resumen-suscripciones-departamentos',
  templateUrl: './tabla-resumen-suscripciones-departamentos.component.html',
  styleUrls: ['./tabla-resumen-suscripciones-departamentos.component.scss']
})
export class TablaResumenSuscripcionesDepartamentosComponent implements OnInit {

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

  lstResumenDepartamentos: ResumenDepartamentosSuscripciones[] = []
  tableLoading: boolean = false;
  totalRegisters: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  sortStr: string | null = '+departamento';

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private suscripcionesSrv: SuscripcionesService
  ) { }

  ngOnInit(): void {
  }

  cargarDatos(){
    this.tableLoading = true;
    forkJoin({
      resumenDepartamentos: this.suscripcionesSrv.getResumenDepartamentos(this.getHttpQueryParams()),
      total: this.suscripcionesSrv.getTotalResumenDepartamentos(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstResumenDepartamentos = resp.resumenDepartamentos;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar resumen de suscripciones por departamento', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
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
