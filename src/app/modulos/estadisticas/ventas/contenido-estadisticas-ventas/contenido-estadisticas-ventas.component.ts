import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { VentasService } from '@servicios/ventas.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { CardResumenVentasGruposServiciosComponent } from '../card-resumen-ventas-grupos-servicios/card-resumen-ventas-grupos-servicios.component';
import { CardResumenVentasCobradoresComponent } from '../card-resumen-ventas-cobradores/card-resumen-ventas-cobradores.component';

@Component({
  selector: 'app-contenido-estadisticas-ventas',
  templateUrl: './contenido-estadisticas-ventas.component.html',
  styleUrls: ['./contenido-estadisticas-ventas.component.scss']
})
export class ContenidoEstadisticasVentasComponent implements OnInit {

  @ViewChild(CardResumenVentasGruposServiciosComponent)
  cardResumenVentasGruposServiciosComp!: CardResumenVentasGruposServiciosComponent;
  @ViewChild(CardResumenVentasCobradoresComponent)
  cardResumenVentasCobradoresComp!: CardResumenVentasCobradoresComponent;

  @Input()
  get paramsFiltros(): IParametroFiltro { return this._paramsFiltros };
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = { ...p };
    if (oldParams !== JSON.stringify(p)) this.cargarTotales();
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
        this.cargarTotales();
      }, 500);
    }
  }
  private _textoBusqueda: string = '';
  private timerBusqueda: any;

  cantFacturas: number = 0;
  cantFactPagadas: number = 0;
  cantFactPendientes: number = 0;
  cantFactAnuladas: number = 0;

  montoTotalPagado: number = 0;
  montoTotalAnulado: number = 0;
  montoTotalPendiente: number = 0;

  loadingMontoPagado: boolean = false;
  loadingMontoPendiente: boolean = false;
  loadingMontoAnulado: boolean = false;

  loadingCantFacturas: boolean = false;
  loadingCantPagadas: boolean = false;
  loadingCantPendientes: boolean = false;
  loadingCantAnuladas: boolean = false

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarTotales();
  }

  private cargarCantidadFacturas() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    const p: IParametroFiltro = { ...this.paramsFiltros };
    delete p['anulado'];
    params = params.appendAll(p);
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    this.loadingCantFacturas = true;
    this.ventasSrv.count(params).subscribe({
      next: (cant) => {
        this.cantFacturas = cant;
        this.loadingCantFacturas = false;
      },
      error: (e) => {
        console.log('Error al cargar total de facturas');
        console.log();
        this.httpErrorHandler.process(e);
        this.loadingCantFacturas = false;
      }
    });
  }

  private cargarCantidadPagadas() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    if (p['pagado'] == 'false' || p['anulado'] == 'true') {
      this.cantFactPagadas = 0;
    } else {
      p['pagado'] = 'true';
      p['anulado'] = 'false';
      params = params.appendAll(p);
      this.loadingCantPagadas = true;
      this.ventasSrv.count(params).subscribe({
        next: (cant) => {
          this.cantFactPagadas = cant;
          this.loadingCantPagadas = false;
        },
        error: (e) => {
          console.log('Error al cargar cantidad de facturas pagadas');
          console.log(e);
          this.httpErrorHandler.process(e);
          this.loadingCantPagadas = false;
        }
      });
    }
  }

  private cargarCantidadPendientes() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    if (p['pagado'] == 'true' || p['anulado'] == 'true') {
      this.cantFactPagadas = 0;
    } else {
      p['pagado'] = 'false';
      p['anulado'] = 'false';
      params = params.appendAll(p);
      this.loadingCantPendientes = true;
      this.ventasSrv.count(params).subscribe({
        next: (cant) => {
          this.cantFactPendientes = cant;
          this.loadingCantPendientes = false;
        },
        error: (e) => {
          console.log('Error al cargar cantidad de facturas pendientes');
          console.log(e);
          this.httpErrorHandler.process(e);
          this.loadingCantPendientes = false;
        }
      });
    }
  }

  private cargarCantidadAnulados() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    delete p['pagado'];
    p['anulado'] = 'true';
    params = params.appendAll(p);
    this.loadingCantAnuladas = true;
    this.ventasSrv.count(params).subscribe({
      next: (cant) => {
        this.cantFactAnuladas = cant;
        this.loadingCantAnuladas = false;
      },
      error: (e) => {
        console.log('Error al cargar cantidad de facturas anuladas');
        console.log(e);
        this.httpErrorHandler.process(e);
        this.loadingCantAnuladas = false;
      }
    });
  }


  private cargarMontoTotalPagado() {
    let params: HttpParams = new HttpParams()
    .append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (p['pagado'] == 'false' || p['anulado'] == 'true') {
      this.montoTotalPagado = 0;
    } else {
      p['pagado'] = 'true';
      p['anulado'] = 'false';
      params = params.appendAll(p);

      this.loadingMontoPagado = true;
      this.ventasSrv.getMontoTotal(params).subscribe({
        next: (monto) => {
          this.montoTotalPagado = monto;
          this.loadingMontoPagado = false;
        },
        error: (e) => {
          console.error('Error al cargar monto total de ventas', e);
          this.httpErrorHandler.process(e);
          this.loadingMontoPagado = false;
        }
      });
    }

  }

  private cargarMontoTotalAnulado() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (p['anulado'] == 'false') {
      this.montoTotalAnulado = 0;
    } else {
      delete p.pagado;
      p['anulado'] = 'true';
      params = params.appendAll(p);

      this.loadingMontoAnulado = true;
      this.ventasSrv.getMontoTotal(params).subscribe((m: number) => {
        this.montoTotalAnulado = m;
        this.loadingMontoAnulado = false;
      }, (e) => {
        console.log('Error al cargar monto total anulado de facturas');
        console.log(e);
        this.httpErrorHandler.process(e);
        this.loadingMontoAnulado = false;
      });
    }

  }

  private cargarMontoTotalPendiente() {
    let params: HttpParams = new HttpParams()
    .append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (p['anulado'] == 'true' || p['pagado'] == 'true') {
      this.montoTotalPendiente = 0;
    } else {
      p['anulado'] = 'false';
      p['pagado'] = 'false';
      params = params.appendAll(p);
      this.loadingMontoPendiente = true;
      this.ventasSrv.getMontoTotal(params).subscribe({
        next: (monto) => {
          this.montoTotalPendiente = monto;
          this.loadingMontoPendiente = false;
        },
        error: (e) => {
          console.log('Error al cargar monto pendiente', e);
          this.httpErrorHandler.process(e);
          this.loadingMontoPendiente = false;
        }
      })
    }
  }

  recargar(){
    this.cargarTotales();
    this.cardResumenVentasCobradoresComp?.cargarDatos();
    this.cardResumenVentasGruposServiciosComp?.refresh();
  }

  cargarTotales() {
    this.cargarCantidadFacturas();
    this.cargarMontoTotalPagado();
    this.cargarMontoTotalAnulado();
    this.cargarMontoTotalPendiente();

    this.cargarCantidadPagadas();
    this.cargarCantidadPendientes();
    this.cargarCantidadAnulados();
  }
}
