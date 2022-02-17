import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ResumenCantSuscDeuda } from '@dto/resumen-cantsusc-deuda-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { EventEmitter } from '@angular/core';

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

  lstDatosResumen: ResumenCantSuscDeuda[] = [];
  loadingDatos: boolean = false;

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

  @Output()
  totalSuscripcionesChange: EventEmitter<number> = new EventEmitter();

  @Output()
  totalDeudaChange: EventEmitter<number> = new EventEmitter();

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
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    return params;
  }

  cargarDatos() {
    this.loadingDatos = true;
    this.suscripcionesSrv.getResumenCuotasPendientes(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<ResumenCantSuscDeuda>) => {
      this.lstDatosResumen = resp.data;
      this.loadingDatos = false;
      this.calcularTotales();
    }, (e) => {
      console.log('Error al cargar resumen de cuotas pendientes');
      console.log(e);
      this.httpErrorHandler.handle(e, 'cargar resumen de cuotas pendientes');
      this.loadingDatos = false;
    });
  }

  private calcularTotales(){
    let totalSusc: number = 0;
    let totalDeuda: number = 0;
    this.lstDatosResumen.forEach((r: ResumenCantSuscDeuda)=>{
      if(r.cantidad) totalSusc += Number(r.cantidad);
      if(r.monto) totalDeuda+= Number(r.monto);
    });
    this.totalSuscripcionesChange.emit(totalSusc);
    this.totalDeudaChange.emit(totalDeuda);
  }

}
