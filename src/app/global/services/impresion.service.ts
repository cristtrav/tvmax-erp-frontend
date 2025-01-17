import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { FacturaPreimpresaVentaComponent } from '../../modules/impresion/factura-preimpresa-venta/factura-preimpresa-venta.component';
import { ReporteSuscripcionesComponent } from '../../modules/impresion/reporte-suscripciones/reporte-suscripciones.component';
import { ReporteVentasComponent } from '../../modules/impresion/reporte-ventas/reporte-ventas.component';
import { ReporteDetallesVentasComponent } from '../../modules/impresion/reporte-detalles-ventas/reporte-detalles-ventas.component';
import { ReporteMovimientoMaterialComponent } from '../../modules/impresion/reporte-movimiento-material/reporte-movimiento-material.component';
import { ReporteMaterialesComponent } from '../../modules/impresion/reporte-materiales/reporte-materiales.component';

@Injectable({
  providedIn: 'root'
})
export class ImpresionService {

  constructor(
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

  imprimirReporteDetallesVentas(
    iframe: ElementRef<HTMLIFrameElement>,
    paramsFiltros: IParametroFiltro,
    viewContainerRef: ViewContainerRef
  ): Observable<boolean>{
    const loading = new BehaviorSubject<boolean>(true);
    const iframeNative = iframe.nativeElement;
    const reporteCobrosComponent = viewContainerRef.createComponent(ReporteDetallesVentasComponent);
    reporteCobrosComponent.instance.cargarDatos(paramsFiltros).subscribe({
      next: () => {
        loading.next(false);
        if(!iframeNative.contentWindow || !iframeNative.contentDocument) return;
        iframeNative.contentDocument.title = 'Reporte Detalles Ventas';
        iframeNative.contentDocument.body.appendChild(reporteCobrosComponent.location.nativeElement);

        setTimeout(() => {
          iframeNative.contentWindow?.print();
        }, 250);

        iframeNative.contentWindow.onafterprint = () => {
          reporteCobrosComponent.destroy();
        }
      },
      error: e => loading.next(false)
    })
    return loading.asObservable();
  }

  imprimirReporteMovimientosMateriales(
    iframe: ElementRef<HTMLIFrameElement>,
    idmovimiento: number,
    viewContainerRef: ViewContainerRef
  ): Observable<boolean>{
    const loading = new BehaviorSubject<boolean>(true);
    const iframeNative = iframe.nativeElement;
    const reporteMovimientosComponent = viewContainerRef.createComponent(ReporteMovimientoMaterialComponent)
    reporteMovimientosComponent.instance.cargarDatos(idmovimiento)
      .pipe(finalize(() => loading.next(false)))
      .subscribe({
        next: () => {
          if(!iframeNative.contentWindow || !iframeNative.contentDocument) return;
          iframeNative.contentDocument.title = 'Movimiento de Materiales';
          iframeNative.contentDocument.body.appendChild(reporteMovimientosComponent.location.nativeElement);

          iframeNative.contentWindow.onafterprint = () => { reporteMovimientosComponent.destroy() }

          setTimeout(() => {
            iframeNative.contentWindow?.print();
          }, 250);
        }
      })
    return loading.asObservable();
  }

  imprimirReporteMateriales(
    iframe: ElementRef<HTMLIFrameElement>,
    viewContainerRef: ViewContainerRef,
    paramsFiltros: IParametroFiltro
  ): Observable<boolean>{
    const loading = new BehaviorSubject<boolean>(true)
    const iframeNative = iframe.nativeElement;
    const reporteMaterialesComponent = viewContainerRef.createComponent(ReporteMaterialesComponent);
    reporteMaterialesComponent.instance.cargarDatos(paramsFiltros)
    .pipe(
      finalize(() => loading.next(false))
    )
    .subscribe(() => {
      if(!iframeNative.contentWindow || !iframeNative.contentDocument) return;
      iframeNative.contentDocument.title = 'Reporte de Materiales';
      iframeNative.contentDocument.body.appendChild(reporteMaterialesComponent.location.nativeElement);
      iframeNative.contentWindow.onafterprint = () => reporteMaterialesComponent.destroy();

      setTimeout(() => {
        iframeNative.contentWindow?.print();
      }, 250);
    });
    return loading.asObservable();
  }

}
