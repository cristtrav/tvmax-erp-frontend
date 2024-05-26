import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenServiciosSuscripciones } from '@dto/resumen-servicios-suscripciones.dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tabla-resumen-suscripciones-servicios',
  templateUrl: './tabla-resumen-suscripciones-servicios.component.html',
  styleUrls: ['./tabla-resumen-suscripciones-servicios.component.scss']
})
export class TablaResumenSuscripcionesServiciosComponent implements OnInit {

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

  lstResumenServicios: ResumenServiciosSuscripciones[] = [];
  sortStr: string | null = '+servicio';
  totalRegisters: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  tableLoading: boolean = false;

  constructor(
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(){
    this.tableLoading = true;
    forkJoin({
      resumenServicios: this.suscripcionesSrv.getResumenServicios(this.getHttpQueryParams()),
      total: this.suscripcionesSrv.getTotalResumenServicios(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstResumenServicios = resp.resumenServicios;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.log('Error al cargar resumen por servicios de suscripciones', e);
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
