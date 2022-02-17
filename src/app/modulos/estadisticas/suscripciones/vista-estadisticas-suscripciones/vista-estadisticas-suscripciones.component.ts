import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vista-estadisticas-suscripciones',
  templateUrl: './vista-estadisticas-suscripciones.component.html',
  styleUrls: ['./vista-estadisticas-suscripciones.component.scss']
})
export class VistaEstadisticasSuscripcionesComponent implements OnInit {

  textoBusqueda: string = '';
  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
