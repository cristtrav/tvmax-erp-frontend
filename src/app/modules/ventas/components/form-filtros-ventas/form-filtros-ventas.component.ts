import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { UsuariosService } from '@services/usuarios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { formatDate } from '@angular/common';
import { UsuarioDTO } from '@dto/usuario.dto';
import { Talonario } from '@dto/facturacion/talonario.dto';
import { TalonariosService } from '@services/facturacion/talonarios.service';
import { finalize } from 'rxjs';
import { EstadoFacturaElectronicaDTO } from '@dto/facturacion/estado-factura-electronica.dto';
import { EstadoFacturaElectronicaService } from '@services/facturacion/estado-factura-electronica.service';

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

  lstTalonarios: Talonario[] = [];
  idtalonarioFiltro: number | null = null;
  loadingTalonarios: boolean = false;

  lstEstadosFacturaElectronica: EstadoFacturaElectronicaDTO[] = [];
  loadingEstadosFacturaElectronica: boolean = false;
  idEstadoFacturaElectronicaSeleccionada: number | null = null;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private usuariosSrv: UsuariosService,
    private talonariosSrv: TalonariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private estadosSifenSrv: EstadoFacturaElectronicaService
  ) { }

  ngOnInit(): void {
    this.cargarCobradoresFiltro();
    this.cargarUsuarioFiltro();
    this.cargarTalonariosFiltro();
    this.cargarEstadosSifen();
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
    if (this.idtalonarioFiltro != null) cant++;
    if (this.idEstadoFacturaElectronicaSeleccionada != null) cant++;
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

  limpiarFiltroTalonario(){
    this.idtalonarioFiltro = null;
    this.filtrar();
  }

  limpiarFiltroEstadoFacturaElectronica(){
    this.idEstadoFacturaElectronicaSeleccionada = null;
    this.filtrar();
  }

  cargarEstadosSifen(){
    const params = new HttpParams()
    .append('sort', '+id');
    this.loadingEstadosFacturaElectronica = true;
    this.estadosSifenSrv.get(params)
    .pipe(finalize(() => this.loadingEstadosFacturaElectronica = false))
    .subscribe((estados) => this.lstEstadosFacturaElectronica = estados);
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
        console.log('Error al cargar cobradores filtro', e);        
        this.httpErrorHandler.process(e);
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
        this.httpErrorHandler.process(e);
      }
    });
  }

  cargarTalonariosFiltro(){
    const params = new HttpParams()
    .append('eliminado', false)
    .append('sort', '-id');
    this.loadingTalonarios = true;
    this.talonariosSrv.get(params)
    .pipe(finalize(() => this.loadingTalonarios = false))
    .subscribe({
      next: (talonarios) => {
        this.lstTalonarios = talonarios;
      },
      error: (e) => {
        console.log('Error al cargar talonarios para filtro', e);
        this.httpErrorHandler.process(e);
      }
    })
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

    if(this.idtalonarioFiltro != null) params['idtalonario'] = this.idtalonarioFiltro;
    if(this.idEstadoFacturaElectronicaSeleccionada != null) params['idestadodte'] = this.idEstadoFacturaElectronicaSeleccionada
    return params;
  }

}
