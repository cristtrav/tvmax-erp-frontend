import { Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { formatDate } from '@angular/common';
import { Usuario } from '@dto/usuario.dto';
import { UsuariosService } from '@servicios/usuarios.service';
import { HttpParams } from '@angular/common/http';
import { finalize } from 'rxjs';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';

@Component({
  selector: 'app-form-filtro-movimientos',
  templateUrl: './form-filtro-movimientos.component.html',
  styleUrls: ['./form-filtro-movimientos.component.scss']
})
export class FormFiltroMovimientosComponent implements OnInit {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();
  
  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;
  tiposMovimientosFiltro: string[] = [];

  lstUsuariosResponsables: Usuario[] = [];
  loadingUsuariosResponsables: boolean = false;
  idusuarioResponsable: number | null = null;

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private usuariosSrv: UsuariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    const httpParams = new HttpParams()
      .append('eliminado', false)
      .append('idrol', 6);
    this.loadingUsuariosResponsables = true;
    this.usuariosSrv
      .get(httpParams)
      .pipe(finalize(() => this.loadingUsuariosResponsables = false))
      .subscribe({
        next: (usuarios) => {
          this.lstUsuariosResponsables = usuarios
        },
        error: (e) => {
          console.error('Error al cargar usuario', e);
          this.httpErrorHandler.process(e);
        }
      })
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

  limpiarFiltroFecha(){
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.filtrar();
  }

  limpiarFiltroTipoMovimiento(){
    this.tiposMovimientosFiltro = [];
    this.filtrar();
  }

  limpiarFiltroResponsableDeposito(){
    this.idusuarioResponsable = null;
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
    if(this.tiposMovimientosFiltro.length > 0) params['tipomovimiento'] = this.tiposMovimientosFiltro;
    if(this.idusuarioResponsable) params['idusuarioresponsable'] = this.idusuarioResponsable;
    return params;
  }

  private getCantidadFiltros(): number{
    let cantidad: number = 0;
    if(this.fechaInicioFiltro != null || this.fechaFinFiltro != null) cantidad++;
    if(this.tiposMovimientosFiltro.length > 0) cantidad++;
    if(this.idusuarioResponsable != null) cantidad++;
    return cantidad;
  }

}
