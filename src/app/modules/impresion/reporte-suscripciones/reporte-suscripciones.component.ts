import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';
import { Barrio } from '@dto/barrio-dto';
import { Departamento } from '@dto/departamento-dto';
import { Distrito } from '@dto/distrito-dto';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { UsuarioDTO } from '@dto/usuario.dto';
import { BarriosService } from '@global-services/barrios.service';
import { DepartamentosService } from '@global-services/departamentos.service';
import { DistritosService } from '@global-services/distritos.service';
import { GruposService } from '@global-services/grupos.service';
import { ServiciosService } from '@global-services/servicios.service';
import { SuscripcionesService } from '@global-services/suscripciones.service';
import { UsuariosService } from '@global-services/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { catchError, forkJoin, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-reporte-suscripciones',
  templateUrl: './reporte-suscripciones.component.html',
  styleUrls: ['./reporte-suscripciones.component.scss', './../estilos-tabla-reportes.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ReporteSuscripcionesComponent implements OnInit {

  estados: string[] = [];
  grupos: Grupo[] = [];
  servicios: Servicio[] = []
  barrios: Barrio[] = [];
  distritos: Distrito[] = []
  departamentos: Departamento[] = [];

  totalDeuda: number = 0;
  private paramsFiltros: IParametroFiltro = {};

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
    private usuariosSrv: UsuariosService
  ) { }

  ngOnInit(): void {
  }

  cargarDatos(paramsFiltros: IParametroFiltro): Observable<any> {
    this.paramsFiltros = paramsFiltros;
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
    if (this.paramsFiltros['idcobrador']) observables.cobrador = this.cargarCobrador(Number(this.paramsFiltros['idcobrador']));

    return forkJoin(observables).pipe(
      tap(resp => {
        if (resp.departamento) this.departamentos = resp.departamento;
        if (resp.distrito) this.distritos = resp.distrito;
        if (resp.barrio) this.barrios = resp.barrio;
        if (resp.grupo) this.grupos = resp.grupo;
        if (resp.servicio) this.servicios = resp.servicio;

        const filtros: IFiltroReporte[] = [];
        this.suscripciones = resp.suscripciones;
        this.totalDeuda = 0;
        this.suscripciones.forEach((s) => {
          this.totalDeuda += Number(s.deuda);
        });
        filtros.push(this.getEstadoFiltroReporte());
        filtros.push(this.getFechaSuscFiltroReporte());
        filtros.push(this.getGrupoServicioFiltroReporte(resp.grupo, resp.servicio));
        filtros.push(
          this.getDepartDistBarrioFiltroReporte(
            resp.departamento,
            resp.distrito,
            resp.barrio
          )
        );
        filtros.push(this.getNroCuotasPendFiltroReporte());
        filtros.push(this.getCobradorFiltroReporte(resp.cobrador));
        filtros.push(this.getTipoSuscripcionFiltroReporte());
        this.lstFiltrosReporte = filtros;
      }),
      catchError(e => {
        console.error('Error al cargar reporte de suscripciones', e);
        this.httpErrorHandler.process(e);
        return of(e);
      })
    );
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

  private cargarServiciosReporte(id: string[] | number[]): Observable<Servicio[]> {
    const params: HttpParams = new HttpParams().append('eliminado', 'false').appendAll({ id });
    return this.serviciosSrv.getServicios(params);
  }

  private cargarCobrador(idusuario: number): Observable<UsuarioDTO> {
    return this.usuariosSrv.getPorId(idusuario);
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

  private getCobradorFiltroReporte(cobrador: UsuarioDTO | null): IFiltroReporte {
    const titulo = 'Cobrador';
    let contenido = '*';
    if (cobrador != null) {
      contenido = `${cobrador.nombres}`;
      if (cobrador.apellidos) contenido += ` ${cobrador.apellidos}`;
    }
    return { titulo, contenido };
  }

  private getTipoSuscripcionFiltroReporte(): IFiltroReporte {
    const gentileza = this.paramsFiltros['gentileza'];
    const titulo = 'Tipo de Suscripción';
    let contenido = '*';
    if (gentileza != null) contenido = `${gentileza ? 'Gentileza' : 'Normal'}`;
    return { titulo, contenido };
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
    const desde: string = this.paramsFiltros['cuotaspendientesdesde'] != null ? `${this.paramsFiltros['cuotaspendientesdesde']}` : '*'
    const hasta: string = this.paramsFiltros['cuotaspendienteshasta'] != null ? `${this.paramsFiltros['cuotaspendienteshasta']}` : '*'
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
