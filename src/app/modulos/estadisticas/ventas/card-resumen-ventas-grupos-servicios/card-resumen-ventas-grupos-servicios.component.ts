import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResumenCantMonto } from '@dto/resumen-cant-monto-dto';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { TablaResumenVentasGruposComponent } from './tabla-resumen-ventas-grupos/tabla-resumen-ventas-grupos.component';
import { TablaResumenVentasServiciosComponent } from './tabla-resumen-ventas-servicios/tabla-resumen-ventas-servicios.component';

@Component({
  selector: 'app-card-resumen-ventas-grupos-servicios',
  templateUrl: './card-resumen-ventas-grupos-servicios.component.html',
  styleUrls: ['./card-resumen-ventas-grupos-servicios.component.scss']
})
export class CardResumenVentasGruposServiciosComponent implements OnInit {

  @ViewChild('tablaResumenGrupos')
  private tablaResumenGrupos!: TablaResumenVentasGruposComponent;

  @ViewChild('tablaResumenServicios')
  private tablaResumenServicios!: TablaResumenVentasServiciosComponent;

  @Input()
  paramsFiltros: IParametroFiltro = {};
  @Input()
  textoBusqueda: string = '';

  pestaniaActiva: 'grupos' | 'servicios' = 'grupos';

  lstResumenDatos: ResumenCantMonto[] = [];
  loadingDatos: boolean = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  setPestaniaActiva(pestania: 'grupos' | 'servicios'){
    this.pestaniaActiva = pestania;
  }

  refresh(){
    this.tablaResumenGrupos?.cargarDatos();
    this.tablaResumenServicios?.cargarDatos();
  }

}