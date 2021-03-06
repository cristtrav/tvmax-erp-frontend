import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FacturaVenta } from '@dto/factura-venta.dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { VentasService } from '@servicios/ventas.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-tabla-ventas',
  templateUrl: './tabla-ventas.component.html',
  styleUrls: ['./tabla-ventas.component.scss']
})
export class TablaVentasComponent implements OnInit {

  @Input()
  get paramsFiltros(): IParametroFiltro {
    return this._paramsFiltros;
  }
  set paramsFiltros(p: IParametroFiltro){
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = p;
    if(oldParams !== JSON.stringify(p)) this.cargarVentas();
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
        this.cargarVentas();
      }, 300);
    }
  }
  private _textoBusqueda: string = '';
  timerBusqueda: any;

  lstFacturasVenta: FacturaVenta[] = [];
  
  sortStr: string | null = '+id';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;
  loadingVentas: boolean = false;
  expandSet = new Set<number>();

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  cargarVentas(){
    this.loadingVentas = true;
    this.ventasSrv.get(this.getHttpParams()).subscribe((resp: ServerResponseList<FacturaVenta>)=>{
      this.totalRegisters = resp.queryRowCount;
      this.lstFacturasVenta = resp.data;
      this.loadingVentas = false;
    }, (e)=>{
      console.log('Error al consultar ventas');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.loadingVentas = false;
    });
  }

  onTableQueryParamsChange(tParams: NzTableQueryParams){
    this.pageIndex = tParams.pageIndex;
    this.pageSize = tParams.pageSize;
    this.sortStr = Extra.buildSortString(tParams.sort);
    this.cargarVentas();
  }

  getHttpParams(): HttpParams{
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    params = params.appendAll(this.paramsFiltros);
    return params;
  }

  private anularFactura(id: number | null): void{
    if(id){
      this.ventasSrv.anular(id).subscribe(()=>{
        for(let fv of this.lstFacturasVenta){
          if(fv.id === id){
            fv.anulado = true;
            break;
          }
        }
        this.notif.create('success', '<b>??xito<b>', 'Factura anulada correctamente');
      }, (e)=>{
        console.log('Error al anular factura');
        console.log(e);
        this.httpErrorHandler.handle(e, 'anular factura');
      });
    }
  }

  private revertirAnulacion(id: number | null): void{
    if(id){
      this.ventasSrv.revertiranul(id).subscribe(()=>{
        /*for(let fv of this.lstFacturasVenta){
          if(fv.id === id){
            fv.anulado = false;
            break;
          }
        }*/
        this.cargarVentas();
        this.notif.create('success','<b>??xito</b>', 'Anulaci??n revertida correctamente');
      }, (e)=>{
        console.log('Error al revertir anulacion de factura');
        console.log(e);
        this.httpErrorHandler.handle(e, 'revertir anulaci??n');
      });
    }
  }

  eliminarVenta(id: number | null): void{
    if(id){
      this.ventasSrv.delete(id).subscribe(()=>{
        this.notif.create('success', '<b>??xito</b>', 'Factura eliminada correctamente');
        this.cargarVentas();
      }, (e)=>{
        console.log('Error al eliminar venta');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

  procesarAnulacion(fv: FacturaVenta | null){
    if(fv){
      if(fv.anulado){
        this.revertirAnulacion(fv.id);
      }else{
        this.anularFactura(fv.id);
      }
    }
  }

}
