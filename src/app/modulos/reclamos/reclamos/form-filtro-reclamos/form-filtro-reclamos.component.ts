import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Usuario } from '@dto/usuario.dto';
import { UsuariosService } from '@servicios/usuarios.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form-filtro-reclamos',
  templateUrl: './form-filtro-reclamos.component.html',
  styleUrls: ['./form-filtro-reclamos.component.scss']
})
export class FormFiltroReclamosComponent implements OnInit {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();
  
  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  estadosSeleccionados: string[] = [];
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  idusuarioregistro: number | null = null;
  idusuarioresponsable: number | null = null;

  lstUsuariosResponsables: Usuario[] = [];
  loadingUsuariosResponsables: boolean = false;

  lstUsuariosRegistro: Usuario[] = [];
  loadingUsuariosRegistro: boolean = false;
  
  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private usuariosSrv: UsuariosService
  ){}

  ngOnInit(): void {
    this.cargarUsuariosResponsables();
    this.cargarUsuariosRegistro();
  }

  cargarUsuariosResponsables(){
    let params = new HttpParams()
      .append('eliminado', false)
      .append('sort', '+razonsocial');
    this.loadingUsuariosResponsables = true;
    this.usuariosSrv
      .get(params)
      .pipe(finalize(() => this.loadingUsuariosResponsables = false))
      .subscribe((usuarios) => this.lstUsuariosResponsables = usuarios);
  }

  cargarUsuariosRegistro(){
    let params = new HttpParams()
      .append('eliminado', false)
      .append('sort', '+razonsocial');
    this.loadingUsuariosRegistro = true;
    this.usuariosSrv
      .get(params)
      .pipe(finalize(() => this.loadingUsuariosRegistro = false))
      .subscribe((usuariosRegistro) => this.lstUsuariosRegistro = usuariosRegistro);
  }

  limpiarFiltroEstados(){
    this.estadosSeleccionados = [];
    this.filtrar();
  }

  limpiarFiltroFecha(){
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.filtrar();
  }

  limpiarFiltroResponsable(){
    this.idusuarioresponsable = null;
    this.filtrar();
  }

  limpiarFiltroUsuarioRegistro(){
    this.idusuarioregistro = null;
    this.filtrar();
  }

  private getCantidadFiltros(): number{
    let cantidad: number = 0;
    if(this.fechaDesde || this.fechaHasta) cantidad++;
    if(this.estadosSeleccionados.length > 0) cantidad++;
    if(this.idusuarioregistro) cantidad++;
    if(this.idusuarioresponsable) cantidad++;
    return cantidad;
  }

  private getQueryParams(): IParametroFiltro{
    const params: IParametroFiltro = {};
    if(this.estadosSeleccionados.length > 0) params['estado'] = this.estadosSeleccionados;
    if(this.fechaDesde) params['fechadesde'] = formatDate(this.fechaDesde, 'yyyy-MM-dd', this.locale);
    if(this.fechaHasta) params['fechahasta'] = formatDate(this.fechaHasta, 'yyyy-MM-dd', this.locale);
    if(this.idusuarioregistro) params['idusuarioregistro'] = this.idusuarioregistro;
    if(this.idusuarioresponsable) params['idusuarioresponsable'] = this.idusuarioresponsable;
    return params;
  }
  
  filtrar(){
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
    this.paramsFiltrosChange.emit(this.getQueryParams());
  }
}
