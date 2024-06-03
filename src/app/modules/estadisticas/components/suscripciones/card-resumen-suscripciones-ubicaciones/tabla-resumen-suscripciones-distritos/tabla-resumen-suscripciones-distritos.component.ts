import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenDistritosSuscripciones } from '@dto/resumen-distritos-suscripciones.dto';
import { SuscripcionesService } from '@services/suscripciones.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tabla-resumen-suscripciones-distritos',
  templateUrl: './tabla-resumen-suscripciones-distritos.component.html',
  styleUrls: ['./tabla-resumen-suscripciones-distritos.component.scss']
})
export class TablaResumenSuscripcionesDistritosComponent implements OnInit {

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

  lstResumenDistritos: ResumenDistritosSuscripciones[] = []
  tableLoading: boolean = false;
  totalRegisters: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  sortStr: string | null = '+distrito';

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private suscripcionesSrv: SuscripcionesService
  ) { }

  ngOnInit(): void {
  }

  cargarDatos(){
    this.tableLoading = true;
    forkJoin({
      resumenDistritos: this.suscripcionesSrv.getResumenDistritos(this.getHttpQueryParams()),
      total: this.suscripcionesSrv.getTotalResumenDistritos(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstResumenDistritos = resp.resumenDistritos;
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
