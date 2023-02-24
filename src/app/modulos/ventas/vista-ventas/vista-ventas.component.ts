import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpresionService } from '@servicios/impresion.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-vista-ventas',
  templateUrl: './vista-ventas.component.html',
  styleUrls: ['./vista-ventas.component.scss']
})
export class VistaVentasComponent implements OnInit {

  @ViewChild("iframe") iframe!: ElementRef<HTMLIFrameElement>;
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
    this.impresionSrv.imprimirReporteVentas(this.iframe, this.paramsFiltros, this.viewConteinerRef)
    .subscribe(loading => this.loadingImpresion = loading);
    /*this.loadingImpresion = true;
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
    });*/
  }

}
