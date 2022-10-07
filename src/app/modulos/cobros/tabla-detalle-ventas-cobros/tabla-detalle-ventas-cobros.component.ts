import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DetalleVentaCobro } from '@dto/detalle-venta-cobro.dto';
import { VentasService } from '@servicios/ventas.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-tabla-detalle-ventas-cobros',
  templateUrl: './tabla-detalle-ventas-cobros.component.html',
  styleUrls: ['./tabla-detalle-ventas-cobros.component.scss']
})
export class TablaDetalleVentasCobrosComponent implements OnInit {

  @Input()
  get paramsFiltros(): IParametroFiltro {
    return this._paramsFiltros;
  }
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = p;
    if (oldParams !== JSON.stringify(p)) this.cargarDetalleCobro();
  }
  _paramsFiltros: IParametroFiltro = {};

  @Input()
  get textoBusqueda(): string { return this._textoBusqueda };
  set textoBusqueda(t: string) {
    const oldSearch: string = this._textoBusqueda;
    this._textoBusqueda = t;
    if (oldSearch !== t) {
      clearTimeout(this.timerBusqueda);
      this.timerBusqueda = setTimeout(() => {
        this.cargarDetalleCobro();
      }, 300);
    }
  }
  private _textoBusqueda: string = '';
  timerBusqueda: any;

  public lstDetallesCobros: DetalleVentaCobro[] = [];
  public cargandoDetalles: boolean = false;
  public pageSize: number = 10;
  public pageIndex: number = 1;
  public totalRegisters: number = 0;
  public sortStr: string | null = '+fecha_factura';
  expandSet = new Set<number>();

  constructor(
    private ventaSrv: VentasService,
    private httpErrorHanler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    //this.cargarDetalleCobro();
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  cargarDetalleCobro(){    
    this.cargandoDetalles = true;
    this.ventaSrv.getDetallesVentaCobros(this.getHttpParams()).subscribe({
      next: (resp) => {
        this.cargandoDetalles = false;
        this.lstDetallesCobros = resp.data;
        this.totalRegisters = resp.queryRowCount;
      },
      error: (e) => {
        console.log('Error al consultar detalle venta cobros');
        console.log(e);
        this.httpErrorHanler.handle(e,'cargar detalles de ventas');
        this.cargandoDetalles = false;
      }
    });
  }

  onTableQueryParamsChange(tParams: NzTableQueryParams) {
    this.pageIndex = tParams.pageIndex;
    this.pageSize = tParams.pageSize;
    this.sortStr = Extra.buildSortString(tParams.sort);
    this.cargarDetalleCobro();
  }

  getHttpParams(): HttpParams{
    let params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('anulado','false');
    params = params.append('pagado', 'true');
    if (this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    params = params.appendAll(this.paramsFiltros);
    if (this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

}
