import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Funcionario } from '@dto/funcionario.dto';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { CobradoresService } from '@servicios/cobradores.service';
import { GruposService } from '@servicios/grupos.service';
import { ServiciosService } from '@servicios/servicios.service';
import { UsuariosService } from '@servicios/usuarios.service';
import { IFormFiltroSkel } from '@util/form-filtro-skel.interface';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-form-filtros-cobros',
  templateUrl: './form-filtros-cobros.component.html',
  styleUrls: ['./form-filtros-cobros.component.scss']
})
export class FormFiltrosCobrosComponent implements OnInit, IFormFiltroSkel {

  @Output()
  paramsFiltrosChange: EventEmitter<IParametroFiltro> = new EventEmitter();
  @Output()
  cantFiltrosChange: EventEmitter<number> = new EventEmitter();

  public fechaInicioCobro: Date | null = null;
  public fechaFinCobro: Date | null = null;

  public idcobrador: number | null = null;
  public lstCobradores: Funcionario[] = [];
  public cargandoCobradores: boolean = false;

  public idusuario: number | null = null;
  public lstUsuarios: Funcionario[] = [];
  public cargandoUsuarios: boolean = false;

  public idgrupo: number | null = null;
  public lstGrupos: Grupo[] = [];
  public cargandoGrupos: boolean = false;

  public idservicio: number | null = null;
  public lstServicios: Servicio[] = [];
  public cargandoServicios: boolean = false;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private cobradorService: CobradoresService,
    private usuarioService: UsuariosService,
    private grupoService: GruposService,
    private serviciosServicie: ServiciosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarCobradores();
    this.cargarUsuarios();
    this.cargarGrupos();
  }

  private cargarGrupos(): void {
    const params: HttpParams = new HttpParams()
      .append('eliminado', 'false')
      .append('sort', '+id');
    this.cargandoGrupos = true;
    this.grupoService.getGrupos(params).subscribe({
      next: (resp) => {
        this.lstGrupos = resp.data;
        this.cargandoGrupos = false;
      },
      error: (e) => {
        console.log('Error al cargar grupos');
        console.log(e);
        this.httpErrorHandler.handle(e, 'cargar grupos');
        this.cargandoGrupos = false;
      }
    });
  }

  private cargarServicios(idgrupo: number): void {
    const params: HttpParams = new HttpParams()
      .append('eliminado', 'false')
      .append('idgrupo', `${idgrupo}`)
      .append('sort', '+descripcion');
    this.cargandoServicios = true;
    this.serviciosServicie.getServicios(params).subscribe({
      next: (resp) => {
        this.cargandoServicios = false;
        this.lstServicios = resp.data;
      },
      error: (e) => {
        console.log('Error al cargar servicios');
        console.log(e);
        this.httpErrorHandler.handle(e, 'cargar servicios');
        this.cargandoServicios = false;
      }
    });
  }

  private cargarCobradores() {
    const params: HttpParams = new HttpParams()
      .append('sort', '+razonsocial')
      .append('eliminado', 'false');
    this.cargandoCobradores = true;
    this.cobradorService.get(params).subscribe({
      next: (resp) => {
        this.lstCobradores = resp.data;
        this.cargandoCobradores = false;
      },
      error: (e) => {
        this.cargandoCobradores = false;
        console.log('Error al cargar cobradores en filtro cobros');
        console.log(e);
        this.httpErrorHandler.handle(e, 'cargar cobradores');
      }
    });
  }

  private cargarUsuarios() {
    const params: HttpParams = new HttpParams()
      .append('sort', '+razonsocial')
      .append('eliminado', 'false');
    this.cargandoUsuarios = true;
    this.usuarioService.get(params).subscribe({
      next: (resp) => {
        this.cargandoUsuarios = false;
        this.lstUsuarios = resp.data;
      },
      error: (e) => {
        console.log('Error al cargar usuarios de filtro de cobro');
        console.log(e);
        this.httpErrorHandler.handle(e, 'cargar usuarios');
        this.cargandoUsuarios = false;
      }
    });
  }

  disabledStartDateCobro = (fechaInicioCobro: Date): boolean => {
    if (!fechaInicioCobro || !this.fechaFinCobro) return false;
    const ffd: Date = new Date(this.fechaFinCobro.getFullYear(), this.fechaFinCobro.getMonth(), this.fechaFinCobro.getDate() + 1);
    return fechaInicioCobro.getTime() > ffd.getTime();
  };

  disabledEndDateCobro = (fechaFinCobro: Date): boolean => {
    if (!fechaFinCobro || !this.fechaInicioCobro) return false;
    const fid: Date = new Date(this.fechaInicioCobro.getFullYear(), this.fechaInicioCobro.getMonth(), this.fechaInicioCobro.getDate() - 1);
    return fechaFinCobro.getTime() <= fid.getTime();
  };

  filtrar() {
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
    this.paramsFiltrosChange.emit(this.getQueryParams());
  }

  limpiarFechaCobro() {
    this.fechaInicioCobro = null;
    this.fechaFinCobro = null;
    this.filtrar();
  }

  limpiarCobrador() {
    this.idcobrador = null;
    this.filtrar();
  }

  limpiarUsuario() {
    this.idusuario = null;
    this.filtrar();
  }

  limpiarGrupo() {
    this.idgrupo = null;
    this.idservicio = null;
    this.filtrar();
  }

  limpiarServicio() {
    this.idservicio = null;
    this.filtrar();
  }

  onGrupoChange(idgrupo: number | null) {
    this.idservicio = null;
    this.lstServicios = [];
    if (idgrupo) this.cargarServicios(idgrupo);
    this.filtrar();
  }

  getQueryParams(): IParametroFiltro {
    const params: IParametroFiltro = {};
    if (this.fechaInicioCobro) params['fechainiciocobro'] = formatDate(this.fechaInicioCobro, 'yyyy-MM-dd', this.locale);
    if (this.fechaFinCobro) params['fechafincobro'] = formatDate(this.fechaFinCobro, 'yyyy-MM-dd', this.locale);
    if (this.idcobrador) params['idcobradorcomision'] = this.idcobrador;
    if (this.idusuario) params['idfuncionarioregistrocobro'] = this.idusuario;
    if (this.idgrupo) params['idgrupo'] = this.idgrupo;
    if (this.idservicio) params['idservicio'] = this.idservicio;
    return params;
  }

  getCantidadFiltros(): number {
    let cant: number = 0;
    if (this.fechaInicioCobro) cant++;
    if (this.fechaFinCobro) cant++;
    if (this.idcobrador) cant++;
    if (this.idusuario) cant++;
    if (this.idgrupo) cant++;
    if (this.idservicio) cant++;
    return cant;
  }

}
