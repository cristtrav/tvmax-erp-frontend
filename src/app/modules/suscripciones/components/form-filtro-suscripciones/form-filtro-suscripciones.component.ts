import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, LOCALE_ID, Inject } from '@angular/core';
import { UsuariosService } from '@services/usuarios.service';
import { IFormFiltroSkel } from '@global-utils/form-filtro-skel.interface';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { NzMarks } from 'ng-zorro-antd/slider';
import { formatDate } from '@angular/common';
import { UsuarioDTO } from '@dto/usuario.dto';

@Component({
  selector: 'app-form-filtro-suscripciones',
  templateUrl: './form-filtro-suscripciones.component.html',
  styleUrls: ['./form-filtro-suscripciones.component.scss']
})
export class FormFiltroSuscripcionesComponent implements OnInit, IFormFiltroSkel {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();
  
  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  gruposServiciosFiltro: string [] = [];
  ubicacionesFiltro: string[] = [];

  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  filtroConectado: boolean = false;
  filtroReconectado: boolean = false;
  filtroDesconectado: boolean = false;

  rangoCuotasPendFiltro: number[] = [0, 13];
  marcasFiltroCuotasPend: NzMarks = {
    '0': '0',
    '12': '12',
    '13': '∞'
  };

  timerFiltroCuotasPend: any;
  filtroGentileza: boolean = false;
  filtroNormal: boolean = false;
  lstCobradores: UsuarioDTO[] = [];
  idcobrador: number | null = null;

  fechaInicioCambioEstado: Date | null = null;
  fechaFinCambioEstado: Date | null = null;

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private usuariosSrv: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cargarCobradores();
  }

  cargarCobradores(){
    const params = new HttpParams()
    .append('eliminado', 'false')
    .append('idrol', '3');
    this.usuariosSrv.get(params).subscribe({
      next: (cobradores) => {
        this.lstCobradores = cobradores;
      },
      error: (e) => {
        console.error('Error al cargar cobradores', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  limpiarFiltrosEstados(){
    this.filtroConectado = false;
    this.filtroReconectado = false;
    this.filtroDesconectado = false;
    this.filtrar();
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.fechaFinFiltro) return false;

    const ffd: Date = new Date(this.fechaFinFiltro.getFullYear(), this.fechaFinFiltro.getMonth(), this.fechaFinFiltro.getDate() + 1);
    return startValue.getTime() > ffd.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fechaInicioFiltro) return false;
    
    const fid: Date = new Date(this.fechaInicioFiltro.getFullYear(), this.fechaInicioFiltro.getMonth(), this.fechaInicioFiltro.getDate() - 1);
    return endValue.getTime() < fid.getTime();
  };

  disabledStartDateCambioEstado = (startValue: Date): boolean => {
    if (!startValue || !this.fechaFinCambioEstado) return false;
    
    const ffd: Date = new Date(this.fechaFinCambioEstado.getFullYear(), this.fechaFinCambioEstado.getMonth(), this.fechaFinCambioEstado.getDate() + 1);
    return startValue.getTime() > ffd.getTime();
  };

  disabledEndDateCambioEstado = (endValue: Date): boolean => {
    if (!endValue || !this.fechaInicioCambioEstado) return false;

    const fid: Date = new Date(this.fechaInicioCambioEstado.getFullYear(), this.fechaInicioCambioEstado.getMonth(), this.fechaInicioCambioEstado.getDate() - 1);
    return endValue.getTime() < fid.getTime();
  };

  filtrar(): void{
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
    this.paramsFiltrosChange.emit(this.getQueryParams());
  }

  getCantidadFiltros(): number{
    let cant: number = 0;
    cant += this.gruposServiciosFiltro.length;
    cant += this.ubicacionesFiltro.length;
    if(this.fechaInicioFiltro || this.fechaFinFiltro) cant++;    
    if(this.filtroConectado) cant++;
    if(this.filtroReconectado) cant++;
    if(this.filtroDesconectado) cant++;
    if(this.rangoCuotasPendFiltro[0] !== 0 || this.rangoCuotasPendFiltro[1] !== 13){
      cant ++;
    }
    if(this.filtroNormal) cant++;
    if(this.filtroGentileza) cant++;
    if(this.idcobrador) cant++;
    if(this.fechaInicioCambioEstado || this.fechaFinCambioEstado) cant++
    return cant;
  }

  limpiarFiltrosGruposServicios(){
    this.gruposServiciosFiltro = [];
    this.filtrar();
  }

  limpiarFiltrosFechaSuscripcion(){
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.filtrar();
  }

  limpiarFiltroRangoCuotasPendientes(){
    this.rangoCuotasPendFiltro = [0, 13];
    this.filtrar();
  }

  limpiarFiltrosUbicacion() {
    this.ubicacionesFiltro = [];
    this.filtrar();
  }

  limpiarFiltroTipoSuscripcion(){
    this.filtroNormal = false;
    this.filtroGentileza = false;
    this.filtrar();
  }

  limpiarFiltroCobrador(){
    this.idcobrador = null;
    this.filtrar();
  }

  limpiarFiltroFechaCambioEstado(){
    this.fechaInicioCambioEstado = null;
    this.fechaFinCambioEstado = null;
    this.filtrar();
  }

  cambioFiltroRango(){
    clearTimeout(this.timerFiltroCuotasPend);
    this.timerFiltroCuotasPend = setTimeout(()=>{
      this.filtrar();
    }, 500);
  }

  formatterTooltipRangoCuotas(value: number): string {
    if(value === 13) return 'Sin límite'
    return `${value}`;
  }

  getQueryParams(): IParametroFiltro {
    const params: IParametroFiltro = {};

    const idgrupos: number[] = [];
    const idservicios: number[] = [];    
    this.gruposServiciosFiltro.forEach((gs: string)=>{
      if(gs.split('-')[0] === 'gru') idgrupos.push(Number(gs.split('-')[1]));
      if(gs.split('-')[0] === 'ser') idservicios.push(Number(gs.split('-')[1]));
    });
    if(idgrupos.length !== 0) params['idgrupo'] = idgrupos;
    if(idservicios.length !== 0) params['idservicio'] = idservicios;
    
    const iddepartamentos: string[] = [];
    const iddistritos: string[] = [];
    const idbarrios: number[] = [];
    
    this.ubicacionesFiltro.forEach((ddb: string)=>{
      if(ddb.includes('dep')) iddepartamentos.push(ddb.split('-')[1]);
      if(ddb.includes('dis')) iddistritos.push(ddb.split('-')[1]);
      if(ddb.includes('bar')) idbarrios.push(Number(ddb.split('-')[1]));
    });
    if(iddepartamentos.length !==0) params['iddepartamento'] = iddepartamentos;
    if(iddistritos.length !== 0) params['iddistrito'] = iddistritos;
    if(idbarrios.length !== 0) params['idbarrio'] = idbarrios;

    if(this.fechaInicioFiltro) params['fechainiciosuscripcion'] = formatDate(this.fechaInicioFiltro, 'yyyy-MM-dd', this.locale);
    if(this.fechaFinFiltro) params['fechafinsuscripcion'] = formatDate(this.fechaFinFiltro, 'yyyy-MM-dd', this.locale);
    
    if(this.fechaInicioCambioEstado) params['fechainiciocambioestado'] = formatDate(this.fechaInicioCambioEstado, 'yyyy-MM-dd', this.locale);
    if(this.fechaFinCambioEstado) params['fechafincambioestado'] = formatDate(this.fechaFinCambioEstado, 'yyyy-MM-dd', this.locale)

    const estados: string[] = [];
    if(this.filtroConectado || this.filtroReconectado || this.filtroDesconectado){
      if(this.filtroConectado) estados.push('C');
      if(this.filtroReconectado) estados.push('R');
      if(this.filtroDesconectado) estados.push('D');
    }
    if(estados.length !== 0) params['estado'] = estados;

    if(this.rangoCuotasPendFiltro[0] !== 0 || this.rangoCuotasPendFiltro[1] !== 13){
      params['cuotaspendientesdesde'] = this.rangoCuotasPendFiltro[0];
      if(this.rangoCuotasPendFiltro[1] !== 13) params['cuotaspendienteshasta'] = this.rangoCuotasPendFiltro[1];
    }

    if(this.filtroNormal != this.filtroGentileza){
      params['gentileza'] = this.filtroGentileza;
    }

    if(this.idcobrador) params['idcobrador'] = this.idcobrador;

    return params;
  }
}
