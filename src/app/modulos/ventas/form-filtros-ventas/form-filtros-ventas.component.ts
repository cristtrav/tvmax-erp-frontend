import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { UsuarioDTO } from '@dto/usuario.dto';
import { UsuariosService } from '@servicios/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { formatDate } from '@angular/common';

const DATE_FORMAT: string = "yyyy-MM-dd";

@Component({
  selector: 'app-form-filtros-ventas',
  templateUrl: './form-filtros-ventas.component.html',
  styleUrls: ['./form-filtros-ventas.component.scss']
})
export class FormFiltrosVentasComponent implements OnInit {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();

  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  @Input()
  set mostrarFiltroGrupoServicio(mostrar: boolean){
    this._mostrarFiltroGrupoServicio = mostrar;
    if(!mostrar) this.grupoServicioFiltro = [];
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
  }
  get mostrarFiltroGrupoServicio(): boolean{
    return this._mostrarFiltroGrupoServicio;
  }
  private _mostrarFiltroGrupoServicio: boolean = false;

  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  fechaInicioCobroFiltro: Date | null = null;
  fechaFinCobroFiltro: Date | null = null;

  lstCobradoresFiltro: UsuarioDTO[] = [];
  idCobradorFiltro: number | null = null;

  lstUsuariosFiltro: UsuarioDTO[] = [];
  idUsuarioCobroFiltro: number | null = null;

  filtroPagado: boolean = false;
  filtroPendiente: boolean = false;
  filtroAnulado: boolean = false;

  grupoServicioFiltro: string[] = [];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private usuariosSrv: UsuariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarCobradoresFiltro();
    this.cargarUsuarioFiltro();
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.fechaFinFiltro) {
      return false;
    }
    const ffd: Date = new Date(this.fechaFinFiltro.getFullYear(), this.fechaFinFiltro.getMonth(), this.fechaFinFiltro.getDate() + 1);
    return startValue.getTime() > ffd.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fechaInicioFiltro) {
      return false;
    }
    const fid: Date = new Date(this.fechaInicioFiltro.getFullYear(), this.fechaInicioFiltro.getMonth(), this.fechaInicioFiltro.getDate() - 1);
    return endValue.getTime() <= fid.getTime();
  };

  disabledStartDateCobro = (startValue: Date): boolean => {
    if (!startValue || !this.fechaFinCobroFiltro) {
      return false;
    }
    const ffd: Date = new Date(this.fechaFinCobroFiltro.getFullYear(), this.fechaFinCobroFiltro.getMonth(), this.fechaFinCobroFiltro.getDate() + 1);
    return startValue.getTime() > ffd.getTime();
  };

  disabledEndDateCobro = (endValue: Date): boolean => {
    if (!endValue || !this.fechaInicioCobroFiltro) {
      return false;
    }
    const fid: Date = new Date(this.fechaInicioCobroFiltro.getFullYear(), this.fechaInicioCobroFiltro.getMonth(), this.fechaInicioCobroFiltro.getDate() - 1);
    return endValue.getTime() <= fid.getTime();
  };

  filtrar() {
    if (this.filtroAnulado) {
      this.filtroPagado = false;
      this.filtroPendiente = false;
    }
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
    this.paramsFiltrosChange.emit(this.getParams());
  }

  limpiarFiltroFechas() {
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.filtrar();
  }

  getCantidadFiltros(): number {
    let cant: number = 0;
    if (this.idCobradorFiltro) cant++;
    if (this.idUsuarioCobroFiltro) cant++;
    if (this.fechaInicioCobroFiltro) cant++;
    if (this.fechaFinCobroFiltro) cant++;
    if (this.fechaInicioFiltro) cant++;
    if (this.fechaFinFiltro) cant++;
    if (this.filtroPagado) cant++;
    if (this.filtroPendiente) cant++;
    if (this.filtroAnulado) cant++;
    if (this.grupoServicioFiltro.length > 0) cant++;
    return cant;    
  }

  limpiarFiltroEstados() {
    this.filtroPendiente = false;
    this.filtroPagado = false;
    this.filtroAnulado = false;
    this.filtrar();
  }

  limpiarFiltrosAnulacion() {
    this.filtroAnulado = false;
    //this.filtroNoAnulado = false;
    this.filtrar();
  }

  limpiarFiltroCobrador() {
    this.idCobradorFiltro = null;
    this.filtrar();
  }

  limpiarFiltroUsuarioCobro() {
    this.idUsuarioCobroFiltro = null;
    this.filtrar();
  }

  limpiarFiltrosFechasCobro() {
    this.fechaInicioCobroFiltro = null;
    this.fechaFinCobroFiltro = null;
    this.filtrar();
  }

  limpiarFiltroGrupoServicio(){
    this.grupoServicioFiltro = [];
    this.filtrar();
  }

  cargarCobradoresFiltro() {
    let params: HttpParams = new HttpParams()
      .append('eliminado', 'false')
      .append('sort', '+razonsocial')
      .append('idrol', '3');
    this.usuariosSrv.get(params).subscribe({
      next: (usuarios) => {
        this.lstCobradoresFiltro = usuarios;
      },
      error: (e) => {
        console.log('Error al cargar cobradores filtro');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    });
  }

  cargarUsuarioFiltro() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+nombres');
    this.usuariosSrv.get(params).subscribe({
      next: (usuarios) => {
        this.lstUsuariosFiltro = usuarios;
      },
      error: (e) => {
        console.log('Error al cargar usuarios del filtro');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    });
  }

  getParams(): IParametroFiltro {
    let params: IParametroFiltro = {};
    params['eliminado'] = 'false';
    params['anulado'] = `${this.filtroAnulado}`;
    if (this.fechaInicioFiltro) params['fechainiciofactura'] = formatDate(this.fechaInicioFiltro, DATE_FORMAT, this.locale);      
    if (this.fechaFinFiltro) params['fechafinfactura'] = formatDate(this.fechaFinFiltro, DATE_FORMAT, this.locale);
    
    if (!this.filtroAnulado && this.filtroPagado != this.filtroPendiente) params['pagado'] = `${this.filtroPagado}`;
    
    if (this.idCobradorFiltro) params['idcobradorcomision'] = `${this.idCobradorFiltro}`;
    if (this.idUsuarioCobroFiltro) params['idusuarioregistrocobro'] = `${this.idUsuarioCobroFiltro}`;

    if (this.fechaInicioCobroFiltro) params['fechainiciocobro'] = formatDate(this.fechaInicioCobroFiltro, DATE_FORMAT, this.locale);
    if (this.fechaFinCobroFiltro) params['fechafincobro'] = formatDate(this.fechaFinCobroFiltro, DATE_FORMAT, this.locale);
    
    if (this.grupoServicioFiltro.length > 0) {
      const filtrosServicios: number[] = this.grupoServicioFiltro.filter(gs => gs.includes('ser')).map(servicio => Number(servicio.split('-')[1]));
      const filtrosGrupos: number[] = this.grupoServicioFiltro.filter(gs => gs.includes('gru')).map(grupo => Number(grupo.split('-')[1]));
      if(filtrosServicios.length > 0)
        params['idservicio'] = this.grupoServicioFiltro.filter(gs => gs.includes('ser')).map(servicio => Number(servicio.split('-')[1]));
      if(filtrosGrupos.length > 0)
        params['idgrupo'] = this.grupoServicioFiltro.filter(gs => gs.includes('gru')).map(grupo => Number(grupo.split('-')[1]));
    }
    return params;
  }

}
