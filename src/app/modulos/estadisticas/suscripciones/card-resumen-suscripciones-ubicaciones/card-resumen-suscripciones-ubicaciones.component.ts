import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { TablaResumenSuscripcionesBarriosComponent } from './tabla-resumen-suscripciones-barrios/tabla-resumen-suscripciones-barrios.component';
import { TablaResumenSuscripcionesDepartamentosComponent } from './tabla-resumen-suscripciones-departamentos/tabla-resumen-suscripciones-departamentos.component';
import { TablaResumenSuscripcionesDistritosComponent } from './tabla-resumen-suscripciones-distritos/tabla-resumen-suscripciones-distritos.component';

@Component({
  selector: 'app-card-resumen-suscripciones-ubicaciones',
  templateUrl: './card-resumen-suscripciones-ubicaciones.component.html',
  styleUrls: ['./card-resumen-suscripciones-ubicaciones.component.scss']
})
export class CardResumenSuscripcionesUbicacionesComponent implements OnInit {

  @ViewChild('tablaResumenDepartamentos')
  private tablaResumenDeparamentos!: TablaResumenSuscripcionesDepartamentosComponent;
  @ViewChild('tablaResumenDistritos')
  private tablaResumenDistritos!: TablaResumenSuscripcionesDistritosComponent;
  @ViewChild('tablaResumenBarrios')
  private tablaResumenBarrios!: TablaResumenSuscripcionesBarriosComponent;

  @Input()
  paramsFiltros: IParametroFiltro = {};
  @Input()
  textoBusqueda: string = '';

  pestaniaActiva: 'departamentos' | 'distritos' | 'barrios' = 'barrios';

  constructor() { }

  ngOnInit(): void {
  }

  setPestaniaActiva(pestania: 'departamentos' | 'distritos' | 'barrios'){
    this.pestaniaActiva = pestania;
  }

  cargarDatos(){
    this.tablaResumenDeparamentos?.cargarDatos();
    this.tablaResumenDistritos?.cargarDatos();
    this.tablaResumenBarrios?.cargarDatos();
  }

}
