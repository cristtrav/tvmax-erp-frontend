import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { ImpresionService } from '@services/impresion.service';
import { ContenidoEstadisticasSuscripcionesComponent } from '../../../estadisticas/components/suscripciones/contenido-estadisticas-suscripciones/contenido-estadisticas-suscripciones.component';
import { TablaSuscripcionesComponent } from '../../components/tabla-suscripciones/tabla-suscripciones.component';


@Component({
  selector: 'app-vista-suscripciones',
  templateUrl: './vista-suscripciones.component.html',
  styleUrls: ['./vista-suscripciones.component.scss']
})
export class VistaSuscripcionesComponent implements OnInit {

  @ViewChild("iframe") iframe!: ElementRef<HTMLIFrameElement>; // target host to render the printable
  @ViewChild(TablaSuscripcionesComponent)
  tablaSuscripcionesComp!: TablaSuscripcionesComponent;
  @ViewChild(ContenidoEstadisticasSuscripcionesComponent)
  estadisticasSuscripcionesComp!: ContenidoEstadisticasSuscripcionesComponent;

  vista: string = 'registros';
  cantFiltrosAplicados: number = 0;
  textoBusqueda: string = '';
  drawerFiltrosVisible: boolean = false;
  paramsFiltro: IParametroFiltro = {};
  loadingDatosReporte: boolean = false;
  componenteReporteRendered: boolean = false;
  dataLoading: boolean = false;

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

  recargar(){
    if(this.tablaSuscripcionesComp) this.tablaSuscripcionesComp.cargarDatos();
    this.estadisticasSuscripcionesComp?.recargar();
  }

}
