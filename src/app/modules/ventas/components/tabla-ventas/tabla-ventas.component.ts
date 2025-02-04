import { HttpParams } from '@angular/common/http';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { Venta } from '@dto/venta.dto';
import { VentasService } from '@services/ventas.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';
import { DTEFileUtilsService } from '@services/sifen-utils/dte-file-utils.service';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { DteDTO } from '@dto/facturacion/factura-electronica.dto';
import { ModalButtonOptions, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DecimalPipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-tabla-ventas',
  templateUrl: './tabla-ventas.component.html',
  styleUrls: ['./tabla-ventas.component.scss']
})
export class TablaVentasComponent implements OnInit {

  private readonly SEIS_MESES_MILLIS = 15778476000;
  private readonly DOS_DIAS_MILLIS = 172800000;

  @Input()
  get paramsFiltros(): IParametroFiltro {
    return this._paramsFiltros;
  }
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = p;
    if (oldParams !== JSON.stringify(p) && !this.primeraCarga) this.cargarVentas();
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
  facturaElectronicaMap: Map<number, DteDTO> = new Map();

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

  //anulando: boolean = false;
  anulandoMap = new Map<number, boolean>();
  eliminandoMap = new Map<number, boolean>();

  //Fix para evitar la llamada doble a cargar ventas al abrir por primera vez
  primeraCarga: boolean = true;

  //Para anulacion de factura electronica
  modalConfirmAnulacionRef!: NzModalRef;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private dteFileUtilsSrv: DTEFileUtilsService,
    private modal: NzModalService
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
      this.facturaElectronicaMap.delete(id);
    }
  }

  cargarVentas() {
    this.loadingVentas = true;
    forkJoin({
      ventas: this.ventasSrv.get(this.getHttpParams()),
      total: this.ventasSrv.getTotal(this.getHttpParams())
    })
    .pipe(finalize(() => {
      this.loadingVentas = false;
      this.primeraCarga = false;
    }))
    .subscribe({
      next: (resp) => {
        this.lstFacturasVenta = resp.ventas;
        this.totalRegisters = resp.total;
        this.expandSet.forEach(idventa => {
          this.cargarDetalleVenta(idventa);
          this.cargarFacturaElectronica(idventa);
        })
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
            fact.idestadodte = fe.idestadodocumento;
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

  private anularFactura(id: number): void {
    this.anulandoMap.set(id, true);
    this.ventasSrv.anular(id)
    .pipe(finalize(() => this.anulandoMap.set(id, false)))
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

  private anularConCancelacion(id: number): void {
    console.log('anular con cancelacion')
    this.anulandoMap.set(id, true);
    this.ventasSrv.cancelar(id)
    .pipe(finalize(() => this.anulandoMap.set(id, false)))
    .subscribe({
      next: () => {
        const venta = this.lstFacturasVenta.find(fv => fv.id == id);
        if(venta) venta.anulado = true;
        if(venta && venta.facturaelectronica) venta.idestadodte = 4;
        this.notif.create('success', '<b>Éxito<b>', 'Factura cancelada correctamente');
      },
      error: (e) => {
        console.error('Error al anular factura', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private anularConNotaCredito(id: number): void {
    this.anulandoMap.set(id, true);
    this.ventasSrv.anularConNotaCredito(id)
    .pipe(finalize(() => this.anulandoMap.set(id, false)))
    .subscribe({
      next: () => {
        this.notif.create('success', '<b>Éxito<b>', 'Nota de crédito generada correctamente');
      },
      error: (e) => {
        console.error('Error al anular factura con nota de credito', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  confirmarEliminacion(fv: Venta){
    let content = this.getResumenVenta(fv);
    if(fv.facturaelectronica){
      if(fv.idestadodte == 1 || fv.idestadodte == 2){
        this.notif.error('<strong>No se puede eliminar</strong>', 'La factura electrónica aprobada por SIFEN');
        return;
      }
  
      if(fv.idestadodte == 4){
        this.notif.error('<strong>No se puede eliminar</strong>', 'La factura electrónica anulada (cancelada)');
        return;
      }
      if(fv.idestadodte == 32){
        this.notif.error('<strong>No se puede eliminar</strong>', 'La factura electrónica enviada a SIFEN');
        return;
      }

      content += `\nObs: Se recomienda editar la factura para evitar saltos de numeración`
    }

    this.modal.confirm({
      nzTitle: '¿Desea eliminar la venta?',
      nzContent: content,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminarVenta(fv.id ?? -1)
    })

  }

  private getResumenVenta(fv: Venta): string{
    const nroFact = fv.prefijofactura + '-' + `${fv.nrofactura ?? 0}`.padStart(7, '0');
    const fechaStr = fv.fechahorafactura ?? fv.fechafactura;
    const fecha = fechaStr != null ? new Date(fechaStr) : new Date();
    const formatoFecha = fv.fechahorafactura != null ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy';
    return `${fv.idtalonario != null ? nroFact : '(Sin factura)'} | Gs.${new DecimalPipe(this.locale).transform(fv.total)} | ${formatDate(fecha, formatoFecha, this.locale)}`;
  }

  private revertirAnulacion(id: number): void {
    this.anulandoMap.set(id, true);
    this.ventasSrv.revertiranul(id)
    .pipe(finalize(() => this.anulandoMap.set(id, false)))
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

  eliminarVenta(id: number): void {
    this.eliminandoMap.set(id, true);
    this.ventasSrv.delete(id)
    .pipe(finalize(() => this.eliminandoMap.set(id, false)))
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

  descargarDTE(idventa: number){
    this.loadingDTEMap.set(idventa, true);
    this.ventasSrv.getDTE(idventa)
    .pipe(finalize(() => this.loadingDTEMap.set(idventa, false)))
    .subscribe({
      next: (dte) => {
        const venta = this.lstFacturasVenta.find(v => v.id == idventa);
        const nombrearchivo = venta != null ? `FACTURA-${venta.prefijofactura}-${(venta.nrofactura ?? 0).toString().padStart(7, '0')}` : 'factura'
        this.dteFileUtilsSrv.downloadDTE(dte, nombrearchivo);
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
        this.dteFileUtilsSrv.downloadKUDE(kude, nombrearchivo);
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

  confirmarAnulacion(fv: Venta){
    if(!fv.facturaelectronica) this.confirmarAnulacionPreimpreso(fv);
    else this.confirmarAnulacionElectronica(fv);
  }

  private confirmarAnulacionElectronica(fv: Venta){
    this.modalConfirmAnulacionRef = this.modal.create({
      nzTitle: `¿Desea anular la factura electrónica?`,
      nzContent: 
        `<p><strong>Factura:</strong> ${this.getResumenVenta(fv)}</p>
        <p><strong>Obs:</strong> Se recomienda anular mediante «Cancelación». Pasadas las 48Hs de la aprobación del documento por SIFEN se debe anular mediante Nota de Crédito.</p>`,
      nzFooter: [
        {
          label: 'Cancelar',
          onClick: () => this.modalConfirmAnulacionRef?.close()
        },
        {
          label: 'Generar Nota de crédito',
          type: 'primary',
          danger: true,
          onClick: () => {
            this.anularConNotaCredito(fv.id ?? -1);
            this.modalConfirmAnulacionRef?.close();
          }
        },
        {
          label: 'Generar Cancelación',
          type: 'primary',
          danger: true,
          onClick: () => {
            this.anularConCancelacion(fv.id ?? -1);
            this.modalConfirmAnulacionRef?.close();
          }
        }
      ]
    })
  }

  private confirmarAnulacionPreimpreso(fv: Venta){
    this.modal.confirm({
      nzTitle: fv.anulado ? '¿Desea revertir la anulación?' : '¿Desea anular la factura?',
      nzContent: this.getResumenVenta(fv),
      nzOkDanger: true,
      nzOkText: fv.anulado ? 'Revertir' : 'Anular',
      nzOnOk: () => {
        if(fv.anulado) this.revertirAnulacion(fv.id ?? -1)
        else this.anularFactura(fv.id ?? -1)  
      }
    });
  }

  private validarAnulacionFacturaElec(fv: Venta): boolean {
    if(fv.facturaelectronica && fv.anulado){
      this.notif.error('<strong>No permitido</strong>', 'No se puede revertir la anulación de una factura electrónica');
      return false;
    }

    if(fv.facturaelectronica && fv.idestadodte != 1 && fv.idestadodte != 2){
      this.notif.error('<strong>No se puede anular</strong>', 'La factura electrónica no fue aprobada por SIFEN');
      return false;
    }

    if(fv.facturaelectronica && fv.fechacambioestadodte == null){
      this.notif.error('<strong>Error</strong>', 'No se puede obtener la fecha de aprobación de la factura electrónica');
      return false;
    }
    return true;
  }

  confirmarAnulacionCancelacion(fv: Venta){
    if(!this.validarAnulacionFacturaElec(fv)) return;

    this.modal.confirm({
      nzTitle: '¿Desea anular la factura electrónica?',
      nzContent: this.getResumenVenta(fv),
      nzOkDanger: true,
      nzOkText: 'Anular',
      nzOnOk: () => this.anularConCancelacion(fv.id ?? -1)
    });
  }

  confirmarAnulacionNotaCredito(fv: Venta){
    if(!this.validarAnulacionFacturaElec(fv)) return;

    this.modal.confirm({
      nzTitle: '¿Desea anular la factura electrónica con nota de crédito?',
      nzContent: this.getResumenVenta(fv),
      nzOkDanger: true,
      nzOkText: 'Generar Nota',
      nzOnOk: () => this.anularConNotaCredito(fv.id ?? -1)
    });
  }

}
