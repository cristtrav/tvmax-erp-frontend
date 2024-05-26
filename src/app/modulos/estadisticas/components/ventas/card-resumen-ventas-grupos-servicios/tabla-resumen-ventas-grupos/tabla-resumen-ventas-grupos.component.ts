import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenGruposVentas } from '@dto/resumen-grupos-ventas.dto';
import { VentasService } from '@servicios/ventas.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tabla-resumen-ventas-grupos',
  templateUrl: './tabla-resumen-ventas-grupos.component.html',
  styleUrls: ['./tabla-resumen-ventas-grupos.component.scss']
})
export class TablaResumenVentasGruposComponent implements OnInit {

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

  tituloColumnaMonto: string = 'Total pagado';
  loadingResumen: boolean = false;
  lstResumenGrupos: ResumenGruposVentas[] = [];

  totalRegisters: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  sortStr: string | null = '+grupo'; 

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService 
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private getHttpQueryParams(): HttpParams {
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (!Object.keys(p).includes('anulado')) p['anulado'] = 'false';
    if (p['anulado'] == 'true') {
      delete p['pagado'];
      this.tituloColumnaMonto = 'Total anulado';
    } else {
      if (!Object.keys(p).includes('pagado')) p['pagado'] = 'true';
      if (p['pagado'] == 'true') this.tituloColumnaMonto = 'Total pagado';
      else this.tituloColumnaMonto = 'Total pendiente';
    }
    let params: HttpParams = new HttpParams().appendAll(p);
    params = params.append('offset', (this.pageIndex-1)*this.pageSize);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('limit', this.pageSize);
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    return params;
  }

  cargarDatos(){
    this.loadingResumen = true;
    forkJoin({
      resumenes: this.ventasSrv.getResumenGrupos(this.getHttpQueryParams()),
      total: this.ventasSrv.getTotalResumenGrupos(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.loadingResumen = false;
        this.lstResumenGrupos = resp.resumenes;
        this.totalRegisters = resp.total;
      },
      error: (e) => {
        console.error('Error al cargar resumenes de ventas por grupo', e);
        this.httpErrorHandler.process(e);
        this.loadingResumen = false;
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
