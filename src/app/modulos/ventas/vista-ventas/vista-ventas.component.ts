import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpresionService } from '@servicios/impresion.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { ReporteVentasComponent } from '../../impresion/reporte-ventas/reporte-ventas.component';

@Component({
  selector: 'app-vista-ventas',
  templateUrl: './vista-ventas.component.html',
  styleUrls: ['./vista-ventas.component.scss']
})
export class VistaVentasComponent implements OnInit {

  @ViewChild("iframe") iframe!: ElementRef;
  vista: 'registros' |'estadisticas' = 'registros';

  textoBusqueda: string = '';
  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;

  expandSet = new Set<number>();

  paramsFiltros: IParametroFiltro = {};
  loadingImpresion: boolean = false;

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private viewConteinerRef: ViewContainerRef,
    private impresionSrv: ImpresionService
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

  imprimir(): void {
    this.loadingImpresion = true;
    this.impresionSrv.imprimirReporte(
      ReporteVentasComponent,
      this.iframe,
      this.componentFactoryResolver,
      this.appRef,
      this.injector,
      this.viewConteinerRef,
      this.paramsFiltros
    ).subscribe({
      next: () => {
        this.loadingImpresion = false;
      },
      error: () => {
        this.loadingImpresion = false;
      }
    });
  }

}
