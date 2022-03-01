import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenCantMonto } from '@dto/resumen-cant-monto-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { VentasService } from '@servicios/ventas.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-card-resumen-ventas-cobradores',
  templateUrl: './card-resumen-ventas-cobradores.component.html',
  styleUrls: ['./card-resumen-ventas-cobradores.component.scss']
})
export class CardResumenVentasCobradoresComponent implements OnInit {

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

  lstResumenDatos: ResumenCantMonto[] = [];
  loadingDatos: boolean = false;

  constructor(
    private ventasSrv: VentasService,
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
    this.ventasSrv.getResumenCobradores(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<ResumenCantMonto>)=>{
      this.lstResumenDatos = resp.data;
      this.loadingDatos = false;      
    }, (e)=>{
      console.log('Error al consultar resumen de ventas por cobradores');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.loadingDatos = false;
    });
  }

}
