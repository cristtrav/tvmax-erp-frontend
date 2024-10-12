import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Venta } from '@dto/venta.dto';
import { VentasService } from '@services/ventas.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';
import { FacturaElectronicaUtilsService } from '@modules/ventas/services/factura-electronica-utils.service';

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
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = p;
    if (oldParams !== JSON.stringify(p)) this.cargarVentas();
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

  lstFacturasVenta: Venta[] = [];
  loadingDetalleMap: { [param: number]: boolean } = {};

  sortStr: string | null = '+id';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;
  loadingVentas: boolean = false;
  expandSet = new Set<number>();

  loadingDTE: boolean = false;
  loadingKuDE: boolean = false;

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private facturaElectronicaUtilsSrv: FacturaElectronicaUtilsService
  ) { }

  ngOnInit(): void {
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
      this.cargarDetalleVenta(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  cargarVentas() {
    this.loadingVentas = true;
    forkJoin({
      ventas: this.ventasSrv.get(this.getHttpParams()),
      total: this.ventasSrv.getTotal(this.getHttpParams())
    }).subscribe({
      next: (resp) => {
        this.lstFacturasVenta = resp.ventas;
        this.totalRegisters = resp.total;
        this.lstFacturasVenta.forEach(v => {
          if (v.id) this.loadingDetalleMap[v.id] = false;
        });
        this.loadingVentas = false;
      },
      error: (e) => {
        console.error('Error al consultar ventas', e);
        this.httpErrorHandler.process(e);
        this.loadingVentas = false;
      }
    });
  }

  private cargarDetalleVenta(idventa: number): void{
    this.loadingDetalleMap[idventa] = true;
    this.ventasSrv.getDetallePorIdVenta(idventa).subscribe({
      next: (detalles) => {
        for(let v of this.lstFacturasVenta){
          if(v.id === idventa){
            v.detalles = detalles;
            break;
          }
        }
        this.loadingDetalleMap[idventa] = false;
      },
      error: (e) => {
        console.log('Error al cargar detalles de venta');
        console.log(e);
        this.httpErrorHandler.handle(e, 'cargar detalle de ventas');
        this.loadingDetalleMap[idventa] = false;
      }
    });
  }

  onTableQueryParamsChange(tParams: NzTableQueryParams) {
    this.pageIndex = tParams.pageIndex;
    this.pageSize = tParams.pageSize;
    this.sortStr = Extra.buildSortString(tParams.sort);
    this.cargarVentas();
  }

  getHttpParams(): HttpParams {
    let params: HttpParams = new HttpParams();    
    if (this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if (this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    params = params.appendAll(this.paramsFiltros);
    return params;
  }

  private anularFactura(id: number | null): void {
    if (id) {
      this.ventasSrv.anular(id).subscribe(() => {
        for (let fv of this.lstFacturasVenta) {
          if (fv.id === id) {
            fv.anulado = true;
            break;
          }
        }
        this.notif.create('success', '<b>Éxito<b>', 'Factura anulada correctamente');
      }, (e) => {
        console.log('Error al anular factura');
        console.log(e);
        this.httpErrorHandler.handle(e, 'anular factura');
      });
    }
  }

  private revertirAnulacion(id: number | null): void {
    if (id) {
      this.ventasSrv.revertiranul(id).subscribe(() => {
        /*for(let fv of this.lstFacturasVenta){
          if(fv.id === id){
            fv.anulado = false;
            break;
          }
        }*/
        this.cargarVentas();
        this.notif.create('success', '<b>Éxito</b>', 'Anulación revertida correctamente');
      }, (e) => {
        console.log('Error al revertir anulacion de factura');
        console.log(e);
        this.httpErrorHandler.handle(e, 'revertir anulación');
      });
    }
  }

  eliminarVenta(id: number | null): void {
    if (id) {
      this.ventasSrv.delete(id).subscribe(() => {
        this.notif.create('success', '<b>Éxito</b>', 'Factura eliminada correctamente');
        this.cargarVentas();
      }, (e) => {
        console.log('Error al eliminar venta');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

  procesarAnulacion(fv: Venta | null) {
    if (fv) {
      if (fv.anulado) {
        this.revertirAnulacion(fv.id);
      } else {
        this.anularFactura(fv.id);
      }
    }
  }

  descargarDTE(idventa: number){
    this.loadingDTE = true;
    this.ventasSrv.getDTE(idventa)
    .pipe(finalize(() => this.loadingDTE = false))
    .subscribe({
      next: (dte) => {
        const venta = this.lstFacturasVenta.find(v => v.id == idventa);
        const nombrearchivo = venta != null ? `${venta.prefijofactura}-${(venta.nrofactura ?? 0).toString().padStart(7, '0')}` : 'factura'
        this.facturaElectronicaUtilsSrv.downloadDTE(dte, nombrearchivo);
      },
      error: (e) => {
        console.error("Error al descargar DTE de factura electrónica", e);
        this.notif.error(
          "<strong>Error al descargar DTE</strong>",
          e.status == 404 ? 'No se encontró el archivo' : e.statusText
        );
      }
    })
  }

  descargarKUDE(idventa: number){
    this.loadingKuDE = true;
    this.ventasSrv.getKUDE(idventa)
    .pipe(finalize(() => this.loadingKuDE = false))
    .subscribe({
      next: (kude) => {
        const venta = this.lstFacturasVenta.find(v => v.id == idventa);
        const nombrearchivo = venta != null ? `${venta.prefijofactura}-${(venta.nrofactura ?? 0).toString().padStart(7, '0')}` : 'factura'
        this.facturaElectronicaUtilsSrv.downloadKUDE(kude, nombrearchivo);
      },
      error: (e) => {
        console.error("Error al descargar KuDE de factura electrónica", e);
        this.notif.error(
          "<strong>Error al descargar KuDE</strong>",
          e.status == 404 ? 'No se encontró el archivo' : e.statusText
        );
      }
    })
  }

}
