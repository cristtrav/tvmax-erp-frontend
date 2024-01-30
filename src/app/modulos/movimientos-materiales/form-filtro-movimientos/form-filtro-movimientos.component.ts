import { Component, EventEmitter, Inject, LOCALE_ID, Output } from '@angular/core';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-form-filtro-movimientos',
  templateUrl: './form-filtro-movimientos.component.html',
  styleUrls: ['./form-filtro-movimientos.component.scss']
})
export class FormFiltroMovimientosComponent {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();
  
  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  constructor(
    @Inject(LOCALE_ID)
    private locale: string
  ){}

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

  limpiarFiltroFecha(){
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.filtrar();
  }

  filtrar(){
    this.paramsFiltrosChange.emit(this.getQueryParams());
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
  }

  private getQueryParams(): IParametroFiltro{
    const params: IParametroFiltro = {};
    if(this.fechaInicioFiltro) params['fechainicio'] = formatDate(this.fechaInicioFiltro, 'yyyy-MM-dd', this.locale);
    if(this.fechaFinFiltro) params['fechafin'] = formatDate(this.fechaFinFiltro, 'yyyy-MM-dd', this.locale);
    //if(this.tiposMaterialesSelec.length > 0) params['idtipomaterial'] = this.tiposMaterialesSelec;
    return params;
  }

  private getCantidadFiltros(): number{
    let cantidad: number = 0;
    if(this.fechaInicioFiltro != null || this.fechaFinFiltro != null) cantidad++;
    return cantidad;
  }

}
