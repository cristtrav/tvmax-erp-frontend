import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Barrio } from '@dto/barrio-dto';
import { Departamento } from '@dto/departamento-dto';
import { Distrito } from '@dto/distrito-dto';
import { Grupo } from '@dto/grupo-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { BarriosService } from '@servicios/barrios.service';
import { DepartamentosService } from '@servicios/departamentos.service';
import { DistritosService } from '@servicios/distritos.service';
import { GruposService } from '@servicios/grupos.service';
import { ServiciosService } from '@servicios/servicios.service';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-reporte-suscripciones',
  templateUrl: './reporte-suscripciones.component.html',
  styleUrls: ['./reporte-suscripciones.component.scss']
})
export class ReporteSuscripcionesComponent implements OnInit {

  estados: string[] = [];
  fechainiciosuscripcion: string = '';
  fechafinsuscripcion: string = '';
  grupos: Grupo[] = [];
  servicios: Servicio[] = []
  barrios: Barrio[] = [];
  distritos: Distrito[] = []
  departamentos: Departamento[] = [];

  totalDeuda: number = 0;

  @Input()
  get paramsFiltros(): IParametroFiltro { return this._paramsFiltros };
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = { ...p};
    if (oldParams !== JSON.stringify(p)) this.cargarDatos();
  };
  private _paramsFiltros: IParametroFiltro = {};

  @Output()
  dataLoaded: EventEmitter<boolean> = new EventEmitter();
  //@Input()
  suscripciones: Suscripcion[] = [];

  constructor(
    private suscripcionesSrv: SuscripcionesService,
    private gruposSrv: GruposService,
    private serviciosSrv: ServiciosService,
    private departamentosSrv: DepartamentosService,
    private distritosSrv: DistritosService,
    private barriosSrv: BarriosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  async cargarDatos(){
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+cliente');
    params = params.appendAll(this.paramsFiltros);
    try{
      const resp: ServerResponseList<Suscripcion> = await this.suscripcionesSrv.get(params).toPromise<ServerResponseList<Suscripcion>>();
      this.suscripciones = resp.data;
      this.totalDeuda = 0;
      this.suscripciones.forEach((s)=>{
        console.log()
        this.totalDeuda += Number(s.deuda);
      });
      if(Array.isArray(this.paramsFiltros['idgrupo'])  && this.paramsFiltros['idgrupo'].length !== 0)
        await this.cargarGruposReporte(this.paramsFiltros['idgrupo']);
      if(Array.isArray(this.paramsFiltros['idservicio']) && this.paramsFiltros['idservicio'].length !== 0)
        await this.cargarServiciosReporte(this.paramsFiltros['idservicio']);
      if(Array.isArray(this.paramsFiltros['idbarrio']))
        await this.cargarBarriosReporte(this.paramsFiltros['idbarrio']);
      if(Array.isArray(this.paramsFiltros['iddistrito']))
        await this.cargarDistritosReporte(this.paramsFiltros['iddistrito']);
      if(Array.isArray(this.paramsFiltros['iddepartamento']))
        await this.cargarDepartamentosReporte(this.paramsFiltros['iddepartamento']);
      this.dataLoaded.emit(true);
    }catch(e){
      console.log('Error al cargar suscripciones para reporte');
      console.log(e);
      this.httpErrorHandler.handle(e);
    }
  };

  private async cargarDepartamentosReporte(id: string[] | number[]){
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({id});
      const consulta: Promise<ServerResponseList<Departamento>> = this.departamentosSrv.get(params).toPromise<ServerResponseList<Departamento>>()
      try{
        this.departamentos = (await consulta).data;
      }catch(e){
        console.log('Error al cargar departamentos para reporte');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
  }

  private async cargarDistritosReporte(id: string[] | number[]){
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({id});
      const consulta: Promise<ServerResponseList<Distrito>> = this.distritosSrv.get(params).toPromise<ServerResponseList<Distrito>>()
      try{
        this.distritos = (await consulta).data;
      }catch(e){
        console.log('Error al cargar distritos para reporte');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
  }

  private async cargarBarriosReporte(id: string[] | number[]){
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({id});
      const consulta: Promise<ServerResponseList<Barrio>> = this.barriosSrv.get(params).toPromise<ServerResponseList<Barrio>>()
      try{
        this.barrios = (await consulta).data;
      }catch(e){
        console.log('Error al cargar barrios para reporte');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
  }

  private async cargarGruposReporte(id: string[] | number[]){
      const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({id});
      const consulta: Promise<ServerResponseList<Grupo>> = this.gruposSrv.getGrupos(params).toPromise<ServerResponseList<Grupo>>()
      try{
        this.grupos = (await consulta).data;
      }catch(e){
        console.log('Error al cargar grupos para reporte');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
  }

  private async cargarServiciosReporte(id: string[] | number[]){
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({id});
    const consulta: Promise<ServerResponseList<Servicio>> = this.serviciosSrv.getServicios(params).toPromise<ServerResponseList<Servicio>>();
    try{
      this.servicios = (await consulta).data;
    }catch(e){
      console.log('Error al cargar servicios para reporte');
      console.log(e);
      this.httpErrorHandler.handle(e);
    }
  }

  estadoArrayConverter(): string[] {
    if (Array.isArray(this.paramsFiltros['estado'])) {
      return this.paramsFiltros['estado'].map((e: string) => {
        if (e === 'C') return 'Conectado';
        if (e === 'R') return 'Reconectado';
        if (e === 'D') return 'Desconectado';
        else return '?';
      });
    } else {
      return [];
    }
  }

  existenParametros(): boolean {
    return Object.keys(this.paramsFiltros).length > 0;
  }

  nombresGrupos(): string[] {
    return this.grupos.map(g => `${g.descripcion}`);
  }

  nombresServicios(): string[]{
    return this.servicios.map( s => `${s.descripcion}`);
  }
}
