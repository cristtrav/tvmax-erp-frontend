import { HttpParams } from '@angular/common/http';
import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { Venta } from '@dto/venta.dto';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { BehaviorSubject, EMPTY, forkJoin, Observable, of, switchMap } from 'rxjs';
import { FacturaPreimpresaVentaComponent } from '../modulos/impresion/factura-preimpresa-venta/factura-preimpresa-venta.component';
import { FormatoFacturaA } from '../modulos/impresion/factura-preimpresa-venta/formato-factura-a';
import { ReporteSuscripcionesComponent } from '../modulos/impresion/reporte-suscripciones/reporte-suscripciones.component';
import { ReporteVentasComponent } from '../modulos/impresion/reporte-ventas/reporte-ventas.component';
import { ClientesService } from './clientes.service';
import { TimbradosService } from './timbrados.service';
import { VentasService } from './ventas.service';

@Injectable({
  providedIn: 'root'
})
export class ImpresionService {

  constructor(
    private ventasSrv: VentasService,
    private timbradosSrv: TimbradosService,
    private clientesSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  imprimirReporteSuscripciones(
    iframe: ElementRef<HTMLIFrameElement>,
    paramsFiltros: IParametroFiltro,
    viewContainerRef: ViewContainerRef
  ): Observable<boolean> {
    const loading = new BehaviorSubject<boolean>(true);
    const reporteComponent = viewContainerRef.createComponent(ReporteSuscripcionesComponent);
    reporteComponent.instance.cargarDatos(paramsFiltros).subscribe({
      next: () => {
        loading.next(false);
        const iframeNative = iframe.nativeElement;
        if (!iframeNative.contentDocument || !iframeNative.contentWindow) return;
        iframeNative.contentDocument.title = 'Reporte Suscripciones';
        iframeNative.contentDocument.body.appendChild(reporteComponent.location.nativeElement);
        setTimeout(() => {
          iframeNative.contentWindow?.print();
        }, 250);
        iframeNative.contentWindow.onafterprint = () => {
          reporteComponent.destroy();
        }
      },
      error: () => { loading.next(false) }
    });
    return loading.asObservable();
  }

  imprimirReporteVentas(
    iframe: ElementRef<HTMLIFrameElement>,
    paramsFiltros: IParametroFiltro,
    viewContainerRef: ViewContainerRef
  ): Observable<boolean>{
    const loading = new BehaviorSubject<boolean>(true);
    const reporteComponent = viewContainerRef.createComponent(ReporteVentasComponent);
    reporteComponent.instance.cargarDatos(paramsFiltros).subscribe({
      next: () => {
        loading.next(false);
        const iframeNative = iframe.nativeElement;
        if(!iframeNative.contentDocument || !iframeNative.contentWindow) return;
        iframeNative.contentDocument.title = "Reporte Ventas";     
        iframeNative.contentDocument.body.appendChild(reporteComponent.location.nativeElement);
        setTimeout(() => {
          iframeNative.contentWindow?.print();
        }, 250);
        iframeNative.contentWindow.onafterprint = () => {
          reporteComponent.destroy();
        }
      },
      error: () => { loading.next(false) }
    });
    return loading.asObservable();
  }

  imprimirFacturaPreimpresa(
    idventa: number,
    iframe: ElementRef<HTMLIFrameElement>,
    viewContainerRef: ViewContainerRef
  ): Observable<boolean> {
    const loading = new BehaviorSubject(true);
    const facturaComponent = viewContainerRef.createComponent(FacturaPreimpresaVentaComponent);
    facturaComponent.instance.cargarDatos(idventa).subscribe({
      next: () => {
        loading.next(false);
        const iframeNative = iframe.nativeElement;
        if (!iframeNative.contentWindow || !iframeNative.contentDocument) return;
        iframeNative.contentDocument.title = 'Factura Venta';
        iframeNative.contentDocument.body.appendChild(facturaComponent.location.nativeElement);
        
        setTimeout(() => {
          iframeNative.contentWindow?.print();
        }, 250);

        iframeNative.contentWindow.onafterprint = () => {
          facturaComponent.destroy();
        }
      },
      error: () => { loading.next(false) }
    })
    /*this.cargarFacturaImpresion(idventa).subscribe({
      next: (data) => {
        const iframeNative = iframe.nativeElement;
        if (!iframeNative.contentWindow || !iframeNative.contentDocument) return;

        iframeNative.contentDocument.title = `Factura Venta ${data.venta.prefijofactura}-${data.venta.nrofactura?.toString().padStart(7, '0')}`
        const facturaComponent = viewContainerRef.createComponent(FacturaPreimpresaVentaComponent);

        facturaComponent.instance.venta = data.venta;
        facturaComponent.instance.detalles = data.detalles;
        if (data.cliente?.direccion) facturaComponent.instance.direccionCliente = data.cliente?.direccion;
        if (data.formatoFactura) facturaComponent.instance.parametros = <FormatoFacturaA>(<unknown>data.formatoFactura.parametros);

        facturaComponent.instance.parametros.mostrarEtiquetas = true;
        facturaComponent.instance.parametros.mostrarGrilla = true;
        facturaComponent.instance.parametros.mostrarBordes = true;

        iframeNative.contentDocument.body.appendChild(facturaComponent.location.nativeElement);
        setTimeout(() => {
          iframeNative.contentWindow?.print();
        }, 250);

        iframeNative.contentWindow.onafterprint = () => {
          console.log('afterprint factura');
          facturaComponent.destroy();
        }
      },
      error: (e) => {
        console.error('Error imprimir factura', e);
        this.httpErrorHandler.process(e);
      }
    });*/
    return loading.asObservable();
  }

  /*private cargarFacturaImpresion(idventa: number): Observable<{
    venta: Venta,
    detalles: DetalleVenta[],
    formatoFactura: FormatoFacturaDTO | null,
    cliente: Cliente | null
  }> {
    const detallesParams = new HttpParams().append('eliminado', 'false');

    return forkJoin({
      venta: this.ventasSrv.getPorId(idventa),
      detalles: this.ventasSrv.getDetallePorIdVenta(idventa, detallesParams)
    }).pipe(
      switchMap(resp => forkJoin({
        venta: of(resp.venta),
        detalles: of(resp.detalles),
        formatoFactura: resp.venta.idtimbrado ? this.timbradosSrv.getFormatoPorTimbrado(resp.venta.idtimbrado) : EMPTY,
        cliente: resp.venta.idcliente ? this.clientesSrv.getPorId(resp.venta.idcliente) : EMPTY
      }))
    )
  }*/

}
