import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SesionService } from '@servicios/sesion.service';
import { VentasService } from '@servicios/ventas.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-contenido-estadisticas-ventas',
  templateUrl: './contenido-estadisticas-ventas.component.html',
  styleUrls: ['./contenido-estadisticas-ventas.component.scss']
})
export class ContenidoEstadisticasVentasComponent implements OnInit {

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
  montoTotalPagado: number = 0;
  montoTotalAnulado: number = 0;
  montoTotalPendiente: number = 0;

  loadingMontoPagado: boolean = false;
  loadingMontoPendiente: boolean = false;
  loadingMontoAnulado: boolean = false;
  loadingCantFacturas: boolean = false;

  mostrarAlertaTotales: boolean = false;

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private sesionSrv: SesionService
  ) { }

  ngOnInit(): void {
    this.cargarTotales();
    this.mostrarAlertaTotales = localStorage.getItem(`${this.sesionSrv.idusuario}-mostrarMsgEstadisticasVentas`) !== 'false';
  }

  private cargarCantidadFacturas() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.appendAll(this.paramsFiltros);
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    this.loadingCantFacturas = true;
    this.ventasSrv.count(params).subscribe((cant: number) => {
      this.cantFacturas = cant;
      this.loadingCantFacturas = false;
    }, (e) => {
      console.log('Error al cargar total de facturas');
      console.log();
      this.httpErrorHandler.handle(e);
      this.loadingCantFacturas = false;
    });
  }

  private cargarMontoTotalPagado() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (p['pagado'] == 'false' || p['anulado'] == 'true') {
      this.montoTotalPagado = 0;
    } else {
      p['pagado'] = 'true';
      p['anulado'] = 'false';
      params = params.appendAll(p);
      
      this.loadingMontoPagado = true;
      this.ventasSrv.getMontoTotal(params).subscribe((m: number) => {
        this.montoTotalPagado = m;
        this.loadingMontoPagado = false;
      }, (e) => {
        console.log('Error al cargar monto total pagado de facturas');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.loadingMontoPagado = false;
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
        this.httpErrorHandler.handle(e);
        this.loadingMontoAnulado = false;
      });
    }

  }

  private cargarMontoTotalPendiente() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (p['anulado'] == 'true' || p['pagado'] == 'true') {
      this.montoTotalPendiente = 0;
    } else {
      p['anulado'] = 'false';
      p['pagado'] = 'false';
      params = params.appendAll(p);
      this.loadingMontoPendiente = true;
      this.ventasSrv.getMontoTotal(params).subscribe((m: number) => {
        this.montoTotalPendiente = m;
        this.loadingMontoPendiente = false;
      }, (e) => {
        console.log('Error al cargar monto total pendiente de facturas');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.loadingMontoPendiente = false;
      });
    }

  }

  cargarTotales() {
    this.cargarCantidadFacturas();
    this.cargarMontoTotalPagado();
    this.cargarMontoTotalAnulado();
    this.cargarMontoTotalPendiente();
  }

  cerrarAlertaTotales() {
    this.mostrarAlertaTotales = false;
    localStorage.setItem(`${this.sesionSrv.idusuario}-mostrarMsgEstadisticasVentas`, 'false');
  }

}
