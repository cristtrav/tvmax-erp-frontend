import { ComponentPortal, ComponentType, DomPortalOutlet, PortalOutlet } from '@angular/cdk/portal';
import { HttpParams } from '@angular/common/http';
import { ApplicationRef, ComponentFactoryResolver, ElementRef, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { Venta } from '@dto/venta.dto';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { BehaviorSubject, EMPTY, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { FacturaPreimpresaVentaComponent } from '../modulos/impresion/factura-preimpresa-venta/factura-preimpresa-venta.component';
import { FormatoFacturaA } from '../modulos/impresion/factura-preimpresa-venta/formato-factura-a';
import { ReporteSuscripcionesComponent } from '../modulos/impresion/reporte-suscripciones/reporte-suscripciones.component';
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
    paramsFiltros: IParametroFiltro | null,
    viewContainerRef: ViewContainerRef
  ): Observable<boolean> {
    const loading = new BehaviorSubject<boolean>(true);
    const reporteComponent = viewContainerRef.createComponent(ReporteSuscripcionesComponent);
    reporteComponent.instance.cargarDatos(paramsFiltros ?? {}).subscribe({
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
      error: (e) => {
        loading.next(false);
      }
    });
    return loading.asObservable();
  }

  imprimirReporte(
    component: ComponentType<any>,
    iframeNative: ElementRef,
    componentFactoryResolver: ComponentFactoryResolver,
    appRef: ApplicationRef,
    injector: Injector,
    viewContainerRef: ViewContainerRef,
    paramsFiltro: IParametroFiltro | null
  ): Observable<any> {
    let portalHost: PortalOutlet | null = null;
    const iframe = iframeNative.nativeElement;
    iframe.contentDocument.title = "TVMax ERP";
    portalHost = new DomPortalOutlet(
      iframe.contentDocument.body,
      componentFactoryResolver,
      appRef,
      injector
    );

    const portal = new ComponentPortal(
      component,
      viewContainerRef
    );
    const attachObj = portalHost.attach(portal);
    if (paramsFiltro) attachObj.instance.paramsFiltros = { ...paramsFiltro };
    let timer: any;
    const obsPrint: Observable<any> = attachObj.instance.dataLoaded.pipe(
      tap({
        next: () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            iframe.contentWindow.print();
          }, 250);
        },
        error: (e) => {
          console.log('Error al imprimir');
          console.log(e);
        }
      })
    );
    attachObj.instance.cargarDatos();
    iframe.contentWindow.onafterprint = () => {
      iframe.contentDocument.body.innerHTML = "";
    };
    Extra.agregarCssImpresion(iframe.contentWindow);
    return obsPrint;
  }

  imprimirFacturaPreimpresa(
    idventa: number,
    iframe: ElementRef<HTMLIFrameElement>,
    viewContainerRef: ViewContainerRef
  ) {
    this.cargarFacturaImpresion(idventa).subscribe({
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
    });

  }

  private cargarFacturaImpresion(idventa: number): Observable<{
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
  }

}
