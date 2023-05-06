import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { TablaDetalleVentasCobrosComponent } from '../tabla-detalle-ventas-cobros/tabla-detalle-ventas-cobros.component';
import { ImpresionService } from '@servicios/impresion.service';

@Component({
  selector: 'app-vista-cobros',
  templateUrl: './vista-cobros.component.html',
  styleUrls: ['./vista-cobros.component.scss']
})
export class VistaCobrosComponent implements OnInit {

  @ViewChild("iframe") iframe!: ElementRef<HTMLIFrameElement>

  @Input()
  public paramsFiltros: IParametroFiltro = {};

  public loadingImpresion: boolean = false;
  public textoBusqueda: string = '';
  public cantFiltrosAplicados: number = 0;
  public drawerFiltrosVisible: boolean = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private impresionSrv: ImpresionService
  ) { }

  ngOnInit(): void {
  }

  public imprimir(){    
    this.impresionSrv.imprimirReporteDetallesVentas(this.iframe, this.paramsFiltros, this.viewContainerRef)
    .subscribe( loading => this.loadingImpresion = loading);
  }

}
