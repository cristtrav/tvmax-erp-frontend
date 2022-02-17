import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResumenCantSuscDeuda } from '@dto/resumen-cantsusc-deuda-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-card-resumen-estados',
  templateUrl: './card-resumen-estados.component.html',
  styleUrls: ['./card-resumen-estados.component.scss']
})
export class CardResumenEstadosComponent implements OnInit {

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
  
  @Output()
  totalActivosChange: EventEmitter<number> = new EventEmitter();

  @Output()
  totalInactivosChange: EventEmitter<number> = new EventEmitter();

  lstResumenDatos: ResumenCantSuscDeuda[] = [];
  loadingDatos: boolean = false;

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
    this.suscripcionesSrv.getResumenEstados(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<ResumenCantSuscDeuda>)=>{
      this.lstResumenDatos = resp.data;
      this.loadingDatos = false;
      this.calcularTotales();
    }, (e)=>{
      console.log('Error al consultar suscripciones por estado');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.loadingDatos = false;
    });
  }

  private calcularTotales(){
    let totalActivos: number = 0;
    let totalInactivos: number = 0;
    this.lstResumenDatos.forEach((r: ResumenCantSuscDeuda)=>{
      switch(r.referencia){
        case 'C':
        case 'R':
          if(r.cantidad) totalActivos += Number(r.cantidad);
          break;
        case 'D':
          if(r.cantidad) totalInactivos+= Number(r.cantidad);
          break;
        default:
          break
      }
    });
    this.totalActivosChange.emit(totalActivos);
    this.totalInactivosChange.emit(totalInactivos);
  }

}
