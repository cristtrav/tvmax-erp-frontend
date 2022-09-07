import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Funcionario } from '@dto/funcionario.dto';
import { CobradoresService } from '@servicios/cobradores.service';
import { UsuariosService } from '@servicios/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

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

  cantFiltrosFacturas: number = 0;
  cantFiltrosCobros: number = 0;

  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  fechaInicioCobroFiltro: Date | null = null;
  fechaFinCobroFiltro: Date | null = null;

  lstCobradoresFiltro: Funcionario[] = [];
  idCobradorFiltro: number | null = null;

  lstUsuariosFiltro: Funcionario[] = [];
  idUsuarioCobroFiltro: number | null = null;

  filtroPagado: boolean = false;
  filtroPendiente: boolean = false;
  filtroAnulado: boolean = false;

  constructor(
    private cobradoresSrv: CobradoresService,
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
    if(this.filtroAnulado){
      this.filtroPagado = false;
      this.filtroPendiente = false;
    }
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
    this.paramsFiltrosChange.emit(this.getParams());
    this.cantFiltrosCobros = this.getCantidadFiltrosCobros();
    this.cantFiltrosFacturas = this.getCantidadFiltrosFacturas();
  }

  limpiarFiltroFechas() {
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.filtrar();
  }

  getCantidadFiltros(): number {
    return this.getCantidadFiltrosCobros() + this.getCantidadFiltrosFacturas();
  }

  getCantidadFiltrosCobros(): number {
    let cantCobro: number = 0;
    if (this.idCobradorFiltro) cantCobro++;
    if (this.idUsuarioCobroFiltro) cantCobro++;
    if (this.fechaInicioCobroFiltro) cantCobro++;
    if (this.fechaFinCobroFiltro) cantCobro++;
    return cantCobro;
  }

  getCantidadFiltrosFacturas(): number {
    let cantFactura: number = 0;
    if (this.fechaInicioFiltro) cantFactura++;
    if (this.fechaFinFiltro) cantFactura++;
    if (this.filtroPagado) cantFactura++;
    if (this.filtroPendiente) cantFactura++;
    if (this.filtroAnulado) cantFactura++;
    return cantFactura;
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

  cargarCobradoresFiltro() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+razonsocial');
    this.cobradoresSrv.get(params).subscribe({
      next: (resp) => {
        this.lstCobradoresFiltro = resp.data;
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
      next: (resp) => {
        this.lstUsuariosFiltro = resp.data;
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
    if (this.fechaInicioFiltro) {
      const fechaInicioStr = `${this.fechaInicioFiltro.getFullYear()}-${(this.fechaInicioFiltro.getMonth() + 1).toString().padStart(2, '0')}-${this.fechaInicioFiltro.getDate().toString().padStart(2, '0')}`;
      params['fechainiciofactura'] = fechaInicioStr;
    }
    if (this.fechaFinFiltro) {
      const fechaFinStr = `${this.fechaFinFiltro.getFullYear()}-${(this.fechaFinFiltro.getMonth() + 1).toString().padStart(2, '0')}-${this.fechaFinFiltro.getDate().toString().padStart(2, '0')}`;
      params['fechafinfactura'] = fechaFinStr;
    }
    params['anulado'] = `${this.filtroAnulado}`;
    if(!this.filtroAnulado){
      if (this.filtroPagado != this.filtroPendiente) params['pagado'] = `${this.filtroPagado}`;
    }
    if (this.idCobradorFiltro) params['idcobradorcomision'] = `${this.idCobradorFiltro}`;
    if (this.idUsuarioCobroFiltro) params['idfuncionarioregistrocobro'] = `${this.idUsuarioCobroFiltro}`;
    if (this.fechaInicioCobroFiltro) {
      const fechaIniCobroStr: string = `${this.fechaInicioCobroFiltro.getFullYear()}-${(this.fechaInicioCobroFiltro.getMonth() + 1).toString().padStart(2, '0')}-${this.fechaInicioCobroFiltro.getDate().toString().padStart(2, '0')}`;
      params['fechainiciocobro'] = fechaIniCobroStr;
    }
    if (this.fechaFinCobroFiltro) {
      const fechaFinCobroStr: string = `${this.fechaFinCobroFiltro.getFullYear()}-${(this.fechaFinCobroFiltro.getMonth() + 1).toString().padStart(2, '0')}-${this.fechaFinCobroFiltro.getDate().toString().padStart(2, '0')}`;
      params['fechafincobro'] = fechaFinCobroStr;
    }
    return params;
  }

}
