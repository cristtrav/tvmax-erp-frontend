import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FacturaVenta } from '@dto/factura-venta.dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { VentasService } from '@servicios/ventas.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-vista-ventas',
  templateUrl: './vista-ventas.component.html',
  styleUrls: ['./vista-ventas.component.scss']
})
export class VistaVentasComponent implements OnInit {

  sortStr: string | null = '+id';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;

  lstFacturasVenta: FacturaVenta[] = [];

  loadingVentas: boolean = false;

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarVentas();
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

  getHttpParams(): HttpParams{
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if(this.sortStr){
      params = params.append('sort', this.sortStr);
    }
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    return params;
  }

  onTableQueryParamsChange(tParams: NzTableQueryParams){
    this.pageIndex = tParams.pageIndex;
    this.pageSize = tParams.pageSize;
    this.sortStr = Extra.buildSortString(tParams.sort);
    this.cargarVentas();
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

  private anularFactura(id: number | null): void{
    if(id){
      this.ventasSrv.anular(id).subscribe(()=>{
        for(let fv of this.lstFacturasVenta){
          if(fv.id === id){
            fv.anulado = true;
            break;
          }
        }
        this.notif.create('success', '<b>Éxito<b>', 'Factura anulada correctamente');
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
        for(let fv of this.lstFacturasVenta){
          if(fv.id === id){
            fv.anulado = false;
            break;
          }
        }
        this.notif.create('success','<b>Éxito</b>', 'Anulación revertida correctamente');
      }, (e)=>{
        console.log('Error al revertir anulacion de factura');
        console.log(e);
        this.httpErrorHandler.handle(e, 'revertir anulación');
      });
    }
  }

  eliminarVenta(id: number | null): void{
    if(id){
      this.ventasSrv.delete(id).subscribe(()=>{
        this.notif.create('success', '<b>Éxito</b>', 'Factura eliminada correctamente');
        this.cargarVentas();
      }, (e)=>{
        console.log('Error al eliminar venta');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }
}
