import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { FacturaPreimpresaVentaComponent } from '../modulos/impresion/factura-preimpresa-venta/factura-preimpresa-venta.component';
import { ReporteSuscripcionesComponent } from '../modulos/impresion/reporte-suscripciones/reporte-suscripciones.component';
import { ReporteVentasComponent } from '../modulos/impresion/reporte-ventas/reporte-ventas.component';
import { ClientesService } from './clientes.service';
import { TimbradosService } from './timbrados.service';
import { VentasService } from './ventas.service';
import { ReporteCobrosComponent } from '../modulos/impresion/reporte-cobros/reporte-cobros.component';

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
    return loading.asObservable();
  }

  imprimirReporteCobros(
    iframe: ElementRef<HTMLIFrameElement>,
    paramsFiltros: IParametroFiltro,
    viewContainerRef: ViewContainerRef
  ): Observable<boolean>{
    const loading = new BehaviorSubject<boolean>(true);
    const iframeNative = iframe.nativeElement;
    const reporteCobrosComponent = viewContainerRef.createComponent(ReporteCobrosComponent);
    reporteCobrosComponent.instance.cargarDatos(paramsFiltros).subscribe({
      next: () => {
        loading.next(false);
        if(!iframeNative.contentWindow || !iframeNative.contentDocument) return;
        iframeNative.contentDocument.title = 'Reporte de Cobros';
        iframeNative.contentDocument.body.appendChild(reporteCobrosComponent.location.nativeElement);

        /*setTimeout(() => {
          iframeNative.contentWindow?.print();
        }, 250);*/

        /*iframeNative.contentWindow.onafterprint = () => {
          reporteCobrosComponent.destroy();
        }*/
      },
      error: e => loading.next(false)
    })
    return loading.asObservable();
  }

}
