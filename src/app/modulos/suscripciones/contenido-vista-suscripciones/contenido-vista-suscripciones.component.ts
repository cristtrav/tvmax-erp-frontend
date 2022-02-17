import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Suscripcion } from './../../../dto/suscripcion-dto';
import { SuscripcionesService } from './../../../servicios/suscripciones.service';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { Extra } from '../../../util/extra';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzDrawerOptions, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-contenido-vista-suscripciones',
  templateUrl: './contenido-vista-suscripciones.component.html',
  styleUrls: ['./contenido-vista-suscripciones.component.scss']
})
export class ContenidoVistaSuscripcionesComponent implements OnInit {

  @Input()
  idcliente: number | null = null;
  @Input()
  mostrarCliente: boolean = false;

  paramsFiltros: IParametroFiltro = {};

  textoBusqueda: string = '';
  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;

  timerBusqueda: any;

  constructor(
  ) { }

  ngOnInit(): void {
    
  }
}