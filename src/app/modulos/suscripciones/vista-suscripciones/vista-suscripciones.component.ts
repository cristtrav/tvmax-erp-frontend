import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import {
  ComponentPortal,
  DomPortalOutlet,
  PortalOutlet} from "@angular/cdk/portal";
import { ReporteSuscripcionesComponent } from '../../impresion/reporte-suscripciones/reporte-suscripciones.component';
import { Extra } from '@util/extra';
import { ImpresionService } from '@servicios/impresion.service';


@Component({
  selector: 'app-vista-suscripciones',
  templateUrl: './vista-suscripciones.component.html',
  styleUrls: ['./vista-suscripciones.component.scss']
})
export class VistaSuscripcionesComponent implements OnInit, OnDestroy {

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
    private impresionSrv: ImpresionService
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

  public printWithSrv(): void{
    this.loadingDatosReporte = true;
    this.impresionSrv.imprimirReporte(
      ReporteSuscripcionesComponent,
      this.iframe,
      this.componentFactoryResolver,
      this.appRef,
      this.injector,
      this.viewContainerRef,
      this.paramsFiltro
    ).subscribe(()=>{
      this.loadingDatosReporte = false;
    });
  }

  /*printMainContent(): void {
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
    Extra.agregarCssImpresion(iframe.contentWindow);
  }*/

}
