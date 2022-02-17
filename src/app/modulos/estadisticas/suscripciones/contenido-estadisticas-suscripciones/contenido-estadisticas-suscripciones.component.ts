import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenCantSuscDeuda } from '@dto/resumen-cantsusc-deuda-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
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
