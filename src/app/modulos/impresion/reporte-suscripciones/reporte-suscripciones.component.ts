import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
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
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-reporte-suscripciones',
  templateUrl: './reporte-suscripciones.component.html',
  styleUrls: ['./reporte-suscripciones.component.scss']
})
export class ReporteSuscripcionesComponent implements OnInit {

  estados: string[] = [];
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
    this._paramsFiltros = { ...p };
    if (oldParams !== JSON.stringify(p)) this.cargarDatos();
  };
  private _paramsFiltros: IParametroFiltro = {};

  @Output()
  dataLoaded: EventEmitter<boolean> = new EventEmitter();

  suscripciones: Suscripcion[] = [];
  lstFiltrosReporte: IFiltroReporte[] = [];

  constructor(
    private suscripcionesSrv: SuscripcionesService,
    private gruposSrv: GruposService,
    private serviciosSrv: ServiciosService,
    private departamentosSrv: DepartamentosService,
    private distritosSrv: DistritosService,
    private barriosSrv: BarriosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    @Inject(LOCALE_ID) private locale: string,
  ) { }

  ngOnInit(): void {
  }

  cargarDatos() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+cliente');
    params = params.appendAll(this.paramsFiltros);
    const observables: { [param: string]: Observable<any> } = { suscripciones: this.suscripcionesSrv.get(params) };

    if (Array.isArray(this.paramsFiltros['idgrupo']) && this.paramsFiltros['idgrupo'].length !== 0)
      observables.grupo = this.cargarGruposReporte(this.paramsFiltros['idgrupo']);
    if (Array.isArray(this.paramsFiltros['idservicio']) && this.paramsFiltros['idservicio'].length !== 0)
      observables.servicio = this.cargarServiciosReporte(this.paramsFiltros['idservicio']);
    if (Array.isArray(this.paramsFiltros['idbarrio']))
      observables.barrio = this.cargarBarriosReporte(this.paramsFiltros['idbarrio']);
    if (Array.isArray(this.paramsFiltros['iddistrito']))
      observables.distrito = this.cargarDistritosReporte(this.paramsFiltros['iddistrito']);
    if (Array.isArray(this.paramsFiltros['iddepartamento']))
      observables.departamento = this.cargarDepartamentosReporte(this.paramsFiltros['iddepartamento']);

    forkJoin(observables).subscribe({
      next: (resp) => {
        if (resp.departamento) this.departamentos = resp.departamento.data;
        if (resp.distrito) this.distritos = resp.distrito.data;
        if (resp.barrio) this.barrios = resp.barrio.data;
        if (resp.grupo) this.grupos = resp.grupo.data
        if (resp.servicio) this.servicios = resp.servicio.data;

        this.lstFiltrosReporte = [];
        this.suscripciones = resp.suscripciones.data;
        this.totalDeuda = 0;
        this.suscripciones.forEach((s) => {
          this.totalDeuda += Number(s.deuda);
        });
        this.lstFiltrosReporte.push(this.getEstadoFiltroReporte());
        this.lstFiltrosReporte.push(this.getFechaSuscFiltroReporte());
        this.lstFiltrosReporte.push(this.getGrupoServicioFiltroReporte(resp.grupo?.data, resp.servicio?.data));
        this.lstFiltrosReporte.push(
          this.getDepartDistBarrioFiltroReporte(
            resp.departamento?.data,
            resp.distrito?.data,
            resp.barrio?.data
          )
        );
        this.lstFiltrosReporte.push(this.getNroCuotasPendFiltroReporte());
        this.dataLoaded.emit(true);
      },
      error: (e) => {
        console.log('Error al cargar datos para reporte');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    });
    this.suscripcionesSrv.get(params);
  };

  private cargarDepartamentosReporte(id: string[] | number[]): Observable<Departamento[]> {
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({ id });
    return this.departamentosSrv.get(params);
  }

  private cargarDistritosReporte(id: string[] | number[]): Observable<Distrito[]> {
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({ id });
    return this.distritosSrv.get(params);
  }

  private cargarBarriosReporte(id: string[] | number[]): Observable<Barrio[]> {
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({ id });
    return this.barriosSrv.get(params);
  }

  private cargarGruposReporte(id: string[] | number[]): Observable<Grupo[]> {
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({ id });
    return this.gruposSrv.getGrupos(params);
  }

  private cargarServiciosReporte(id: string[] | number[]): Observable<ServerResponseList<Servicio>> {
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({ id });
    return this.serviciosSrv.getServicios(params);
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

  private getEstadoFiltroReporte(): IFiltroReporte {
    const titulo: string = 'Estado'
    let contenido: string = '*';
    if (Array.isArray(this.paramsFiltros['estado'])) {
      contenido = this.paramsFiltros['estado'].map((e: string) => {
        if (e === 'C') return 'Conectado';
        if (e === 'R') return 'Reconectado';
        if (e === 'D') return 'Desconectado';
        else return '?';
      }).join(',');
    }
    return { titulo, contenido };
  }

  private getFechaSuscFiltroReporte(): IFiltroReporte {
    const titulo: string = 'Fecha de Susc.'
    let desde: string = '*';
    let hasta: string = '*';
    if (this.paramsFiltros['fechainiciosuscripcion']) {
      desde = formatDate(this.paramsFiltros['fechainiciosuscripcion'].toString(), 'dd/MM/yy', this.locale);;
    }
    if (this.paramsFiltros['fechafinsuscripcion']) {
      hasta = formatDate(this.paramsFiltros['fechafinsuscripcion'].toString(), 'dd/MM/yy', this.locale);;
    }
    return { titulo, contenido: `desde ${desde} hasta ${hasta}` };
  }

  private getGrupoServicioFiltroReporte(grp: Grupo[] | null, srv: Servicio[] | null): IFiltroReporte {
    const titulo: string = 'Grupo/Servicio';
    const contenidos: string[] = [];
    if (grp) {
      for (let g of grp) contenidos.push(`${g.descripcion} / *`);
    }
    if (srv) {
      for (let s of srv) contenidos.push(`${s.grupo} / ${s.descripcion}`)
    }
    if (contenidos.length > 0) return { titulo, contenidos };
    return { titulo, contenido: '* / *' };
  }

  private getDepartDistBarrioFiltroReporte(
    dep: Departamento[] | null,
    dis: Distrito[] | null,
    bar: Barrio[] | null): IFiltroReporte {
    const titulo: string = 'Depart./Dist./Barrio';
    const contenidos: string[] = [];
    if (dep) {
      for (let de of dep) contenidos.push(`${de.descripcion} / * / *`);
    }
    if (dis) {
      for (let di of dis) contenidos.push(`${di.departamento} / ${di.descripcion} / *`);
    }
    if (bar) {
      for (let ba of bar) contenidos.push(`${ba.departamento} / ${ba.distrito} / ${ba.descripcion}`);
    }
    if (contenidos.length > 0) return { titulo, contenidos };
    return { titulo, contenido: '* / * / *' };
  }

  private getNroCuotasPendFiltroReporte(): IFiltroReporte {
    const titulo: string = 'Nro. Cuotas';
    const desde: string = this.paramsFiltros['cuotaspendientesdesde'] ? `${this.paramsFiltros['cuotaspendientesdesde']}` : '*'
    const hasta: string = this.paramsFiltros['cuotaspendienteshasta'] ? `${this.paramsFiltros['cuotaspendienteshasta']}` : '*'
    return { titulo, contenido: `desde ${desde} hasta ${hasta}` };
  }

  existenParametros(): boolean {
    return Object.keys(this.paramsFiltros).length > 0;
  }

  nombresGrupos(): string[] {
    return this.grupos.map(g => `${g.descripcion}`);
  }

  nombresServicios(): string[] {
    return this.servicios.map(s => `${s.descripcion}`);
  }

  cargarFiltroReporte() {

  }
}
