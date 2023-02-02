import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-contenido-estadisticas-suscripciones',
  templateUrl: './contenido-estadisticas-suscripciones.component.html',
  styleUrls: ['./contenido-estadisticas-suscripciones.component.scss']
})
export class ContenidoEstadisticasSuscripcionesComponent implements OnInit {

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

  totalSuscripciones: number = 0;
  totalSuscActivos: number = 0;
  totalSuscDesconectadas: number = 0;
  totalDeuda: number = 0;

  constructor(
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.suscripcionesSrv.getResumenGeneral(this.getHttpQueryParams()).subscribe({
      next: (resumen) => {
        this.totalSuscripciones = resumen.cantidadTotal;
        this.totalSuscActivos = resumen.cantidadActivos;
        this.totalSuscDesconectadas = resumen.cantidadDesconectados;
        this.totalDeuda = resumen.monto;
      },
      error: (e) => {
        console.error('Error al cargar resumen general de suscripciones', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private getHttpQueryParams(): HttpParams {
    let params: HttpParams = new HttpParams()
    .appendAll(this.paramsFiltros)
    .append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    return params;
  }

}
