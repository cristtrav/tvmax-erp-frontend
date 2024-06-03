import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { TablaResumenSuscripcionesGruposComponent } from './tabla-resumen-suscripciones-grupos/tabla-resumen-suscripciones-grupos.component';
import { TablaResumenSuscripcionesServiciosComponent } from './tabla-resumen-suscripciones-servicios/tabla-resumen-suscripciones-servicios.component';

@Component({
  selector: 'app-card-resumen-suscripciones-grupos-servicios',
  templateUrl: './card-resumen-suscripciones-grupos-servicios.component.html',
  styleUrls: ['./card-resumen-suscripciones-grupos-servicios.component.scss']
})
export class CardResumenSuscripcionesGruposServiciosComponent implements OnInit {

  @ViewChild('tablaResumenGrupos')
  private tablaResumenGrupos!: TablaResumenSuscripcionesGruposComponent;
  
  @ViewChild('tablaResumenServicios')
  private tablaResumenServicios!: TablaResumenSuscripcionesServiciosComponent;

  @Input()
  paramsFiltros: IParametroFiltro = {};
  @Input()
  textoBusqueda: string = '';

  pestaniaActiva: 'grupos' | 'servicios' = 'grupos';

  constructor() { }

  ngOnInit(): void {
  }

  setPestaniaActiva(pestania: 'grupos' | 'servicios'){
    this.pestaniaActiva = pestania;
  }

  cargarDatos(){
    this.tablaResumenGrupos?.cargarDatos();
    this.tablaResumenServicios?.cargarDatos();
  }

}
