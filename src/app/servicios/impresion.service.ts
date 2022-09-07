import { ComponentPortal, ComponentType, DomPortalOutlet, PortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { ApplicationRef, ComponentFactoryResolver, ElementRef, Injectable, Injector, TemplateRef, ViewContainerRef } from '@angular/core';
import { Extra } from '@util/extra';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpresionService {

  constructor() { }

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

}
