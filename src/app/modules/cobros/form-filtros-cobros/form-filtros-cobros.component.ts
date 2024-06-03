import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output, ViewChild } from '@angular/core';
import { UsuarioDTO } from '@dto/usuario.dto';
import { ServiciosService } from '@services/servicios.service';
import { UsuariosService } from '@services/usuarios.service';
import { IFormFiltroSkel } from '@global-utils/form-filtro-skel.interface';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { TreeUtils } from '@global-utils/tree-utils';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';


@Component({
  selector: 'app-form-filtros-cobros',
  templateUrl: './form-filtros-cobros.component.html',
  styleUrls: ['./form-filtros-cobros.component.scss']
})
export class FormFiltrosCobrosComponent implements OnInit, IFormFiltroSkel {

  @ViewChild('treeSelectServicios') treeSelectServicios!: NzTreeSelectComponent;

  @Output()
  paramsFiltrosChange: EventEmitter<IParametroFiltro> = new EventEmitter();
  @Output()
  cantFiltrosChange: EventEmitter<number> = new EventEmitter();

  public fechaInicioCobro: Date | null = null;
  public fechaFinCobro: Date | null = null;

  public idcobrador: number | null = null;
  public lstCobradores: UsuarioDTO[] = [];
  public cargandoCobradores: boolean = false;

  public idusuario: number | null = null;
  public lstUsuarios: UsuarioDTO[] = [];
  public cargandoUsuarios: boolean = false;

  public nodosGruposServicios: NzTreeNodeOptions[] = [];
  public idgruposIdservicios: string[] = [];

  public treeNodeServiciosVirtualScroll: string | null = null;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private usuarioService: UsuariosService,
    private serviciosServicie: ServiciosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarCobradores();
    this.cargarUsuarios();
    this.cargarGruposServicios();
  }

  onExpandTreeSelectServicios(event: NzFormatEmitEvent) {
    let cantNodosVisibles: number = this.nodosGruposServicios.length;
    for (let treeNode of this.treeSelectServicios.getExpandedNodeList()) {
      cantNodosVisibles += treeNode.getChildren().length;
    }
    this.treeNodeServiciosVirtualScroll = cantNodosVisibles > 11 ? '300px' : null;
  }

  private cargarCobradores() {
    const params: HttpParams = new HttpParams()
      .append('sort', '+razonsocial')
      .append('eliminado', 'false')
      .append('idrol', '3');
    this.cargandoCobradores = true;
    this.usuarioService.get(params).subscribe({
      next: (usuarios) => {
        this.lstCobradores = usuarios
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

  private cargarGruposServicios() {
    const params: HttpParams = new HttpParams()
      .append('eliminado', 'false');
    this.serviciosServicie.getServicios(params).subscribe({
      next: (servicios) => {
        this.nodosGruposServicios = TreeUtils.serviciosToNodos(servicios);
        this.treeNodeServiciosVirtualScroll = this.nodosGruposServicios.length > 11 ? '300px' : null;
      },
      error: (e) => {
        console.log('Error al cargar servicios');
        console.log(e);
        this.httpErrorHandler.handle(e, 'cargar servicios');
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
        this.lstUsuarios = resp;
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

  limpiarGrupoServicio() {
    this.idgruposIdservicios = [];
    this.filtrar();
  }

  getQueryParams(): IParametroFiltro {
    const params: IParametroFiltro = {};
    if (this.fechaInicioCobro) params['fechainiciocobro'] = formatDate(this.fechaInicioCobro, 'yyyy-MM-dd', this.locale);
    if (this.fechaFinCobro) params['fechafincobro'] = formatDate(this.fechaFinCobro, 'yyyy-MM-dd', this.locale);
    if (this.idcobrador) params['idcobradorcomision'] = this.idcobrador;
    if (this.idusuario) params['idusuario'] = this.idusuario;

    const idgrupos: number[] = this.idgruposIdservicios
      .filter(key => !key.includes('-'))
      .map(key => Number(key));

    const idservicios: number[] = this.idgruposIdservicios
      .filter(key => key.includes('-'))
      .map(key => Number(key.substring(key.indexOf('-') + 1, key.length)));

    if (idgrupos.length > 0) params['idgrupo'] = idgrupos;
    if (idservicios.length > 0) params['idservicio'] = idservicios;
    return params;
  }

  getCantidadFiltros(): number {
    let cant: number = 0;
    if (this.fechaInicioCobro) cant++;
    if (this.fechaFinCobro) cant++;
    if (this.idcobrador) cant++;
    if (this.idusuario) cant++;
    if (this.idgruposIdservicios.length > 0) cant++;
    return cant;
  }

}
