import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuarioDTO } from '@dto/usuario.dto';
import { IFormFiltroSkel } from '@util/form-filtro-skel.interface';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { UsuariosService } from '@services/usuarios.service';

@Component({
  selector: 'app-form-filtro-clientes',
  templateUrl: './form-filtro-clientes.component.html',
  styleUrls: ['./form-filtro-clientes.component.scss']
})
export class FormFiltroClientesComponent implements OnInit, IFormFiltroSkel {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();
  
  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  lstCobradoresFiltro: UsuarioDTO[] = [];
  cobradoresSeleccionadosFiltro: number[] = [];

  ubicacionesSelec: string[] = [];

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private usuariosSrv: UsuariosService
  ) { }

  ngOnInit(): void {
    this.cargarCobradoresFiltro();
  }

  filtrar(): void {    
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
    this.paramsFiltrosChange.emit(this.getQueryParams());
  }

  limpiarFiltroCobradores(){
    this.cobradoresSeleccionadosFiltro = [];
    this.filtrar();
  }

  limpiarFiltrosUbicacion(){
    this.ubicacionesSelec = [];
    this.filtrar();
  }

  cargarCobradoresFiltro(){
    let params: HttpParams = new HttpParams()
    .append('eliminado', 'false')
    .append('sort', '+razonsocial')
    .append('idrol', '3');
    this.usuariosSrv.get(params).subscribe({
      next: (usuarios) => {
        this.lstCobradoresFiltro = usuarios;
      },
      error: (e) => {
        console.error('Error al cargar cobradores', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  getCantidadFiltros(): number {
    let cant: number = 0;
    cant += this.cobradoresSeleccionadosFiltro.length;
    cant += this.ubicacionesSelec.length;
    return cant;
  }

  getQueryParams(): IParametroFiltro {
    const params: IParametroFiltro = {};
    if(this.cobradoresSeleccionadosFiltro.length !== 0) params['idcobrador'] = this.cobradoresSeleccionadosFiltro;

    params['idbarrio'] = this.ubicacionesSelec.filter(item => item.includes('bar')).map(item => Number(item.split('-')[1]));
    params['iddistrito'] = this.ubicacionesSelec.filter(item => item.includes('dis')).map(item => item.split('-')[1]);
    params['iddepartamento'] = this.ubicacionesSelec.filter(item => item.includes('dep')).map(item => item.split('-')[1]);    
    return params;
  }

}
