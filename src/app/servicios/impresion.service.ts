import { DomPortalOutlet, PortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { ApplicationRef, ComponentFactoryResolver, ElementRef, Injectable, Injector, TemplateRef, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImpresionService {

  private portalHost!: PortalOutlet;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef
  ) { }

  imprimir(template: TemplateRef<any>, iframeNative: any): void {
    //const iframe = this.iframe.nativeElement;
    this.portalHost = new DomPortalOutlet(
      iframeNative.contentDocument.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
    const portal = new TemplatePortal(
      template,
      this.viewContainerRef,
      {}
    );
    this.portalHost.attach(portal);
    iframeNative.contentWindow.onafterprint = () => {
      iframeNative.contentDocument.body.innerHTML = "";
    };
    this._attachStyles(iframeNative.contentWindow);

    setTimeout(() => {
      iframeNative.contentWindow.print();  
    }, 5000);
    
  }

  private _attachStyles(targetWindow: Window): void {
    // Copy styles from parent window
    document.querySelectorAll("style").forEach(htmlElement => {
      targetWindow.document.head.appendChild(htmlElement.cloneNode(true));
    });
    // Copy stylesheet link from parent window
    const styleSheetElement = this._getStyleSheetElement();
    targetWindow.document.head.appendChild(styleSheetElement);
  }

  private _getStyleSheetElement() {
    const styleSheetElement = document.createElement("link");
    document.querySelectorAll("link").forEach(htmlElement => {
      if (htmlElement.rel === "stylesheet") {
        const absoluteUrl = new URL(htmlElement.href).href;
        styleSheetElement.rel = "stylesheet";
        styleSheetElement.type = "text/css";
        styleSheetElement.href = absoluteUrl;
      }
    });
    console.log(styleSheetElement.sheet);
    return styleSheetElement;
  }
}
