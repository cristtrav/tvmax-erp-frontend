import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { PortalOutlet } from "@angular/cdk/portal";
import { ReporteSuscripcionesComponent } from '../../impresion/reporte-suscripciones/reporte-suscripciones.component';
import { ImpresionService } from '@servicios/impresion.service';


@Component({
  selector: 'app-vista-suscripciones',
  templateUrl: './vista-suscripciones.component.html',
  styleUrls: ['./vista-suscripciones.component.scss']
})
export class VistaSuscripcionesComponent implements OnInit {

  @ViewChild("iframe") iframe!: ElementRef<HTMLIFrameElement>; // target host to render the printable

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
    private viewContainerRef: ViewContainerRef,
    public impresionSrv: ImpresionService
  ) { }

  ngOnInit(): void {
    const v: string | null = this.aroute.snapshot.queryParamMap.get('vista');
    this.cambiarVista(v === null ? 'registros' : v);
  }

  cambiarVista(v: string) {
    this.vista = (v !== 'registros' && v !== 'estadisticas') ? 'registros' : v;
    this.router.navigate([], {
      relativeTo: this.aroute,
      queryParams: { vista: this.vista },
      queryParamsHandling: 'merge'
    });
  }

  public printWithSrv(): void {
    this.impresionSrv.imprimirReporteSuscripciones(this.iframe, this.paramsFiltro, this.viewContainerRef)
    .subscribe(loading => this.loadingDatosReporte = loading);
  }

}
