import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SuscripcionesService } from '@services/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { CardResumenCuotasPendientesComponent } from '../card-resumen-cuotas-pendientes/card-resumen-cuotas-pendientes.component';
import { CardResumenEstadosComponent } from '../card-resumen-estados/card-resumen-estados.component';
import { CardResumenSuscripcionesGruposServiciosComponent } from '../card-resumen-suscripciones-grupos-servicios/card-resumen-suscripciones-grupos-servicios.component';
import { CardResumenSuscripcionesUbicacionesComponent } from '../card-resumen-suscripciones-ubicaciones/card-resumen-suscripciones-ubicaciones.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contenido-estadisticas-suscripciones',
  templateUrl: './contenido-estadisticas-suscripciones.component.html',
  styleUrls: ['./contenido-estadisticas-suscripciones.component.scss']
})
export class ContenidoEstadisticasSuscripcionesComponent implements OnInit {

  @ViewChild(CardResumenCuotasPendientesComponent)
  cardResumenCuotasComp!: CardResumenCuotasPendientesComponent;

  @ViewChild(CardResumenEstadosComponent)
  cardResumenEstados!: CardResumenEstadosComponent;

  @ViewChild(CardResumenSuscripcionesGruposServiciosComponent)
  cardResumenGruposServComp!: CardResumenSuscripcionesGruposServiciosComponent;

  @ViewChild(CardResumenSuscripcionesUbicacionesComponent)
  cardResumenUbicacionesComp!: CardResumenSuscripcionesUbicacionesComponent;

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
  loadingTotales: boolean = false;

  constructor(
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loadingTotales = true;
    this.suscripcionesSrv.getResumenGeneral(this.getHttpQueryParams())
    .pipe(finalize(() => this.loadingTotales = false))
    .subscribe({
      next: (resumen) => {
        this.totalSuscripciones = resumen.cantidadTotal ?? 0;
        this.totalSuscActivos = resumen.cantidadActivos ?? 0;
        this.totalSuscDesconectadas = resumen.cantidadDesconectados ?? 0;
        this.totalDeuda = resumen.monto ?? 0;
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

  recargar(){
    this.cargarDatos();
    this.cardResumenCuotasComp?.cargarDatos();
    this.cardResumenEstados?.cargarDatos();
    this.cardResumenGruposServComp?.cargarDatos();
    this.cardResumenUbicacionesComp?.cargarDatos();
  }

}
