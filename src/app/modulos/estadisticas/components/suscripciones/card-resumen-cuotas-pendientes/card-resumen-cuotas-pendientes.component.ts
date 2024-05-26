import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { ResumenCuotasPendientesSuscripciones } from '@dto/resumen-cuotas-pendientes.dto';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Extra } from '@util/extra';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-card-resumen-cuotas-pendientes',
  templateUrl: './card-resumen-cuotas-pendientes.component.html',
  styleUrls: ['./card-resumen-cuotas-pendientes.component.scss']
})
export class CardResumenCuotasPendientesComponent implements OnInit {

  @Input()
  get paramsFiltros(): IParametroFiltro { return this._paramsFiltros };
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = { ...p };
    if (oldParams !== JSON.stringify(p)) this.cargarDatos();;
  };
  private _paramsFiltros: IParametroFiltro = {};

  lstDatosResumen: ResumenCuotasPendientesSuscripciones[] = [];
  loadingDatos: boolean = false;
  sortStr: string | null = '+cuotaspendientes'
  pageIndex: number = 1;
  pageSize: number = 5;
  totalRegisters: number = 0;

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
    params = params.append('offset', (this.pageIndex - 1) * this.pageSize);
    params = params.append('limit', this.pageSize);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    return params;
  }

  cargarDatos() {
    this.loadingDatos = true;
    forkJoin({
      resumen: this.suscripcionesSrv.getResumenCuotasPendientes(this.getHttpQueryParams()),
      total: this.suscripcionesSrv.getTotalResumenCuotasPendientes(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstDatosResumen = resp.resumen;
        this.totalRegisters = resp.total;
        this.loadingDatos = false;
      },
      error: (e) => {
        console.log('Error al cargar resumen de cuotas pendientes', e);
        this.httpErrorHandler.process(e);
        this.loadingDatos = false;
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
