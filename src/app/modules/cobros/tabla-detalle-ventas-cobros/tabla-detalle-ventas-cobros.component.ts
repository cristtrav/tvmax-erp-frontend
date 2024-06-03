import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CobroDetalleVenta } from '@dto/cobro-detalle-venta.dto';
import { CobrosService } from '@services/cobros.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tabla-detalle-ventas-cobros',
  templateUrl: './tabla-detalle-ventas-cobros.component.html',
  styleUrls: ['./tabla-detalle-ventas-cobros.component.scss']
})
export class TablaDetalleVentasCobrosComponent implements OnInit {

  @Input()
  idcliente: number | null = null;
  @Input()
  idsuscripcion: number | null = null;
  @Input()
  mostrarColumnaCliente: boolean = true;

  @Input()
  get paramsFiltros(): IParametroFiltro {
    return this._paramsFiltros;
  }
  set paramsFiltros(p: IParametroFiltro) {
    let tmpParams = {...p};
    delete tmpParams.sort;
    delete tmpParams.offset;
    delete tmpParams.limit;
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = tmpParams;
    if (oldParams !== JSON.stringify(tmpParams)) this.cargarDetalleCobro();
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

  public lstDetallesCobros: CobroDetalleVenta[] = [];
  public cargandoDetalles: boolean = false;
  public pageSize: number = 10;
  public pageIndex: number = 1;
  public totalRegisters: number = 0;
  public sortStr: string | null = '+fechafactura';
  expandSet = new Set<number>();

  constructor(
    private cobrosSrv: CobrosService,
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
    forkJoin({
      detallesCobros: this.cobrosSrv.getCobrosDetalles(this.getHttpParams()),
      total: this.cobrosSrv.getTotalCobrosDetalles(this.getHttpParams())
    }).subscribe({
      next: (resp) => {
        this.lstDetallesCobros = resp.detallesCobros;
        this.totalRegisters = resp.total;
        this.cargandoDetalles = false;
      },
      error: (e) => {
        console.error('Error al consultar detalles de cobros', e);
        this.httpErrorHanler.process(e);
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
    let params: HttpParams = new HttpParams();
    if(this.paramsFiltros.anulado == null) params = params.append('anulado','false');
    if (this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    params = params.appendAll(this.paramsFiltros);
    if(this.idcliente != null) params = params.append('idcliente', `${this.idcliente}`);
    if(this.idsuscripcion != null) params = params.append('idsuscripcion', `${this.idsuscripcion}`);
    if (this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

}
