import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import {
  ComponentPortal,
  DomPortalOutlet,
  PortalOutlet,
  TemplatePortal
} from "@angular/cdk/portal";
import { GruposService } from '@servicios/grupos.service';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { ServiciosService } from '@servicios/servicios.service';
import { Departamento } from '@dto/departamento-dto';
import { Barrio } from '@dto/barrio-dto';
import { Distrito } from '@dto/distrito-dto';
import { DepartamentosService } from '@servicios/departamentos.service';
import { DistritosService } from '@servicios/distritos.service';
import { BarriosService } from '@servicios/barrios.service';
import { ReporteSuscripcionesComponent } from '../../impresion/reporte-suscripciones/reporte-suscripciones.component';


@Component({
  selector: 'app-vista-suscripciones',
  templateUrl: './vista-suscripciones.component.html',
  styleUrls: ['./vista-suscripciones.component.scss']
})
export class VistaSuscripcionesComponent implements OnInit, OnDestroy {

  @ViewChild(ReporteSuscripcionesComponent)
  private reporteSuscComp!: ReporteSuscripcionesComponent;
  @ViewChild("iframe") iframe!: ElementRef; // target host to render the printable
  private portalHost!: PortalOutlet;

  vista: string = 'registros';
  cantFiltrosAplicados: number = 0;
  textoBusqueda: string = '';
  drawerFiltrosVisible: boolean = false;
  paramsFiltro: IParametroFiltro = {};
  loadingDatosReporte: boolean = false;
  componenteReporteRendered: boolean = false;

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    const v: string | null = this.aroute.snapshot.queryParamMap.get('vista');
    this.cambiarVista(v === null ? 'registros' : v);
  }

  ngOnDestroy(): void {
    if(this.portalHost) this.portalHost.detach();
  }

  cambiarVista(v: string) {
    this.vista = (v !== 'registros' && v !== 'estadisticas') ? 'registros' : v;
    this.router.navigate([], {
      relativeTo: this.aroute,
      queryParams: { vista: this.vista },
      queryParamsHandling: 'merge'
    });
  }

  printMainContent(): void {
    this.loadingDatosReporte = true;
    const iframe = this.iframe.nativeElement;
    iframe.contentDocument.title = "TVMax ERP";
    this.portalHost = new DomPortalOutlet(
      iframe.contentDocument.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
    const portal = new ComponentPortal(ReporteSuscripcionesComponent, this.viewContainerRef);
    const attachObj = this.portalHost.attach(portal);
    attachObj.instance.paramsFiltros = { ...this.paramsFiltro };
    let timer: any;
    attachObj.instance.dataLoaded.subscribe(() => {
      this.loadingDatosReporte = false;
      clearTimeout(timer);
      timer = setTimeout(() => {
        iframe.contentWindow.print();
      }, 250);
    })
    attachObj.instance.cargarDatos();
    iframe.contentWindow.onafterprint = () => {
      iframe.contentDocument.body.innerHTML = "";
    };
    this._attachStyles(iframe.contentWindow);
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
