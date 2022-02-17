import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IFormFiltroSkel } from '@util/form-filtro-skel.interface';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzMarks } from 'ng-zorro-antd/slider';

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

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
  ) {}

  ngOnInit(): void {
  }

  limpiarFiltrosEstados(){
    this.filtroConectado = false;
    this.filtroReconectado = false;
    this.filtroDesconectado = false;
    this.filtrar();
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
    const fid: Date = new Date(this.fechaInicioFiltro.getFullYear(), this.fechaInicioFiltro.getMonth(), this.fechaInicioFiltro.getDate()-1);
    return endValue.getTime() <= fid.getTime();
  };

  filtrar(): void{
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
    this.paramsFiltrosChange.emit(this.getQueryParams());
  }

  getCantidadFiltros(): number{
    let cant: number = 0;
    cant += this.gruposServiciosFiltro.length;
    cant += this.ubicacionesFiltro.length;
    if(this.fechaInicioFiltro) cant++;
    if(this.fechaFinFiltro) cant++;
    if(this.filtroConectado) cant++;
    if(this.filtroReconectado) cant++;
    if(this.filtroDesconectado) cant++;
    if(this.rangoCuotasPendFiltro[0] !== 0 || this.rangoCuotasPendFiltro[1] !== 13){
      cant ++;
    }
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

    if(this.fechaInicioFiltro){
      const finiciostr: string = `${this.fechaInicioFiltro.getFullYear()}-${(this.fechaInicioFiltro.getMonth() + 1).toString().padStart(2 ,'0')}-${this.fechaInicioFiltro.getDate().toString().padStart(2, '0')}`;
      params['fechainiciosuscripcion'] = finiciostr;
    }
    if(this.fechaFinFiltro){
      const ffinstr: string = `${this.fechaFinFiltro.getFullYear()}-${(this.fechaFinFiltro.getMonth() + 1).toString().padStart(2 ,'0')}-${this.fechaFinFiltro.getDate().toString().padStart(2, '0')}`;
      params['fechafinsuscripcion'] = ffinstr;
    }

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
    return params;
  }
}
