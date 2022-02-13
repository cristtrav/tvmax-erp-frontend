import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Cobrador } from '@dto/cobrador-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { CobradoresService } from '@servicios/cobradores.service';
import { IFormFiltroSkel } from '@util/form-filtro-skel.interface';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

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

  lstCobradoresFiltro: Cobrador[] = [];
  cobradoresSeleccionadosFiltro: number[] = [];

  ubicacionesSelec: string[] = [];

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private cobradoresSrv: CobradoresService
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
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+razon_social');
    this.cobradoresSrv.get(params).subscribe((resp: ServerResponseList<Cobrador>)=>{
      this.lstCobradoresFiltro = resp.data;
    }, (e)=>{
      console.log('Error al cargar cobradores');
      console.log(e);
      this.httpErrorHandler.handle(e);
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
