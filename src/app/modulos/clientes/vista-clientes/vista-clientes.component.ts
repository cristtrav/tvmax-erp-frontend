import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { Cliente } from './../../../dto/cliente-dto';
import { ClientesService } from './../../../servicios/clientes.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { Extra } from '../../../util/extra';
import { Cobrador } from '@dto/cobrador-dto';
import { CobradoresService } from '@servicios/cobradores.service';

@Component({
  selector: 'app-vista-clientes',
  templateUrl: './vista-clientes.component.html',
  styleUrls: ['./vista-clientes.component.scss']
})
export class VistaClientesComponent implements OnInit {

  lstClientes: Cliente[] = [];
  total: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  tablaLoading = false;
  expandSet = new Set<number>();
  sortStr: string | null = '+razonsocial'

  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;

  textoBusqueda: string = '';
  timerBusqueda: any;

  lstCobradoresFiltro: Cobrador[] = [];
  cobradoresSeleccionadosFiltro: number[] = [];

  constructor(
    private cliSrv: ClientesService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private cobradoresSrv: CobradoresService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarCobradoresFiltro();
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

  cargarDatos(): void {
    this.tablaLoading = true;
    this.cliSrv.get(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<Cliente>) => {
      this.lstClientes = resp.data;
      this.total = resp.queryRowCount;
      this.tablaLoading = false
    }, (e) => {
      console.log('Error al cargar clientes');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.tablaLoading = false;
    });
  }

  eliminar(id: number | null): void {
    if (id !== null) {
      this.cliSrv.delete(id).subscribe(() => {
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e) => {
        console.log('Error al eliminar cliente');
        console.log(e);
        this.httpErrorHandler.handle(e);
        //this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

  onTableParamsChange(params: NzTableQueryParams): void{
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos(); 
  }

  onRowExpand(id: number, checked: boolean): void{
    if(checked){
      this.expandSet.add(id);
    }else{
      this.expandSet.delete(id);
    }
  }

  getHttpQueryParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    if(this.sortStr){
      params = params.append('sort', this.sortStr);
    }
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if(this.textoBusqueda){
      params = params.append('search', this.textoBusqueda);
    }
    if(this.cobradoresSeleccionadosFiltro){
      console.log(this.cobradoresSeleccionadosFiltro);
      this.cobradoresSeleccionadosFiltro.forEach((idcob: number)=>{
        params = params.append('idcobrador[]', idcob);
      });
    }
    return params;
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(()=>{
      this.cargarDatos();
    }, 500);
  }

  calcularCantidadFiltros(){
    let cant: number = 0;
    cant += this.cobradoresSeleccionadosFiltro.length;
    this.cantFiltrosAplicados = cant;
  }

  filtroCobradoresChange(){
    this.calcularCantidadFiltros();
    this.cargarDatos();
  }

  limpiarFiltroCobradores(){
    this.cobradoresSeleccionadosFiltro = [];
    this.calcularCantidadFiltros();
    this.cargarDatos();
  }

}
