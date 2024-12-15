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
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { FacturaElectronicaDTO } from '@dto/facturacion/factura-electronica.dto';

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
  loadDetalleMap: Map<number, boolean> = new Map();
  loadFacturaElectronicaMap: Map<number, boolean> = new Map();
  facturaElectronicaMap: Map<number, FacturaElectronicaDTO> = new Map();

  sortStr: string | null = '+id';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;
  loadingVentas: boolean = false;
  expandSet = new Set<number>();

  //loadingDTE: boolean = false;
  //loadingKuDE: boolean = false;

  loadingConsultaDTEMap = new Map<number, boolean>();
  loadingDTEMap = new Map<number, boolean>();
  loadingKudeMap = new Map<number, boolean>();

  public readonly DETALLES_ELE_RESPONSIVE_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 24, lg: 8, xl: 8, xxl: 8 };
  public readonly DETALLES_PRE_RESPONSIVE_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 };

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
      const venta = this.lstFacturasVenta.find(f => f.id == id);
      if(venta && venta.facturaelectronica) this.cargarFacturaElectronica(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  cargarVentas() {
    this.loadingVentas = true;
    forkJoin({
      ventas: this.ventasSrv.get(this.getHttpParams()),
      total: this.ventasSrv.getTotal(this.getHttpParams())
    })
    .pipe(finalize(() => this.loadingVentas = false))
    .subscribe({
      next: (resp) => {
        this.lstFacturasVenta = resp.ventas;
        this.totalRegisters = resp.total;
        this.lstFacturasVenta.forEach(v => {
          this.loadDetalleMap.set(v.id ?? -1, false);
        });
      },
      error: (e) => {
        console.error('Error al consultar ventas', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private cargarDetalleVenta(idventa: number): void{
    this.loadDetalleMap.set(idventa, true);
    this.ventasSrv.getDetallePorIdVenta(idventa)
    .pipe(finalize(() => this.loadDetalleMap.set(idventa, false)))
    .subscribe({
      next: (detalles) => {
        const venta = this.lstFacturasVenta.find(fv => fv.id == idventa)
        if(venta) venta.detalles = detalles;
      },
      error: (e) => {
        console.error('Error al cargar detalles de venta', e);
        this.httpErrorHandler.process(e);        
      }
    });
  }

  private cargarFacturaElectronica(idventa: number){
    this.loadFacturaElectronicaMap.set(idventa, true);
    this.ventasSrv.getFacturaElectronica(idventa)
    .pipe(finalize(() => this.loadFacturaElectronicaMap.set(idventa, false)))
    .subscribe({
      next: fe => {
        this.facturaElectronicaMap.set(idventa, fe);
        this.lstFacturasVenta = this.lstFacturasVenta.map(fact => {
          if(fact.id == idventa){
            fact.idestadofacturaelectronica = fe.idestadodocumento;
            return fact;
          }
          return fact;
        })
      },
      error: (e) => {
        console.error('Error al cargar factura electronica', e);
        this.httpErrorHandler.process(e);
      }
    })
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
      this.ventasSrv.anular(id)
      .subscribe({
        next: () => {
          const venta = this.lstFacturasVenta.find(fv => fv.id == id);
          if(venta) venta.anulado = true;
          this.notif.create('success', '<b>Éxito<b>', 'Factura anulada correctamente');
        },
        error: (e) => {
          console.error('Error al anular factura', e);
          this.httpErrorHandler.process(e);
        }
      });
    }
  }

  private revertirAnulacion(id: number | null): void {
    if (id) {
      this.ventasSrv.revertiranul(id)
      .subscribe({
        next: () => {
          this.cargarVentas();
          this.notif.create('success', '<b>Éxito</b>', 'Anulación revertida correctamente');
        },
        error: (e) => {
          console.error('Error al revertir anulacion de factura', e);
          this.httpErrorHandler.process(e);
        }
      });
    }
  }

  eliminarVenta(id: number | null): void {
    if (id) {
      this.ventasSrv.delete(id)
      .subscribe({
        next: () => {
          this.notif.create('success', '<b>Éxito</b>', 'Factura eliminada correctamente');
          this.cargarVentas();
        },
        error: (e) => {
          console.error('Error al eliminar venta', e);
          this.httpErrorHandler.process(e);
        }
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
    this.loadingDTEMap.set(idventa, true);
    this.ventasSrv.getDTE(idventa)
    .pipe(finalize(() => this.loadingDTEMap.set(idventa, false)))
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
    this.loadingKudeMap.set(idventa, true);    
    this.ventasSrv.getKUDE(idventa)
    .pipe(finalize(() => this.loadingKudeMap.set(idventa, false)))
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

  consutlarSifen(id: number){
    this.loadingConsultaDTEMap.set(id, true);
    this.ventasSrv.consultarFacturaSifen(id)
    .pipe(finalize(() => this.loadingConsultaDTEMap.set(id, false)))
    .subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Factura sincronizada');
        this.cargarFacturaElectronica(id);
      },
      error: (e) => {
        console.log('Error al consultar factura en SIFEN', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

}
