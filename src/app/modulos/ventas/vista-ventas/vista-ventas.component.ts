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
  vista: 'facturas' | 'detalles' | 'estadisticas' = 'facturas';

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
    this.cambiarVista(v === 'facturas' || v === 'detalles' || v === 'estadisticas' ? v : 'facturas');
  }

  cambiarVista(v: 'facturas' | 'detalles' | 'estadisticas') {
    this.vista = v;
    this.router.navigate([], {
      relativeTo: this.aroute,
      queryParams: { vista: this.vista },
      queryParamsHandling: 'merge'
    });
  }

  imprimir(): void {
    if (this.vista === 'detalles') {
      this.impresionSrv.imprimirReporteDetallesVentas(
        this.iframe,
        {...this.paramsFiltros, search: this.textoBusqueda},
        this.viewConteinerRef)
    } else {
      this.impresionSrv.imprimirReporteVentas(
        this.iframe,
        {...this.paramsFiltros, search: this.textoBusqueda},
        this.viewConteinerRef)
        .subscribe(loading => this.loadingImpresion = loading);
    }
  }

}
