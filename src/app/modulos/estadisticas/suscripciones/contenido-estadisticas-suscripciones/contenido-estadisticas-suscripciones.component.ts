import { Component, Input, OnInit } from '@angular/core';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-contenido-estadisticas-suscripciones',
  templateUrl: './contenido-estadisticas-suscripciones.component.html',
  styleUrls: ['./contenido-estadisticas-suscripciones.component.scss']
})
export class ContenidoEstadisticasSuscripcionesComponent implements OnInit {

  @Input()
  paramsFiltros: IParametroFiltro = {};

  @Input()
  textoBusqueda: string = '';

  totalSuscripciones: number = 0;
  totalSuscActivos: number = 0;
  totalSuscInactivos: number = 0;
  totalDeuda: number = 0;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  cargarDatos() {
  }

}
