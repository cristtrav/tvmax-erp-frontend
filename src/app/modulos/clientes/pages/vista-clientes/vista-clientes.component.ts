import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { UsuarioDTO } from '@dto/usuario.dto';
import { forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LatLngTuple } from 'leaflet';
import { Cliente } from '@dto/cliente-dto';
import { ClientesService } from '@servicios/clientes.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { UbicacionComponent } from 'src/app/modulos/domicilios/ubicacion/ubicacion.component';

@Component({
  selector: 'app-vista-clientes',
  templateUrl: './vista-clientes.component.html',
  styleUrls: ['./vista-clientes.component.scss']
})
export class VistaClientesComponent implements OnInit {

  @ViewChild(UbicacionComponent)
  ubicacionComp!: UbicacionComponent;

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

  lstCobradoresFiltro: UsuarioDTO[] = [];
  cobradoresSeleccionadosFiltro: number[] = [];

  paramsFiltros: IParametroFiltro = {};

  modalUbicacionVisible: boolean = false;
  ubicacionActual: LatLngTuple | null = null;

  constructor(
    private cliSrv: ClientesService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  cerrarModalUbicacion(){
    this.modalUbicacionVisible = false;
  }

  mostrarModalUbicacion(ubicacion: LatLngTuple){
    this.ubicacionActual = ubicacion;
    this.modalUbicacionVisible = true;
  }

  cargarDatos(): void {
    this.tablaLoading = true;
    forkJoin({
      clientes: this.cliSrv.get(this.getHttpQueryParams()),
      total: this.cliSrv.getTotal(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstClientes = resp.clientes;
        this.total = resp.total;
        this.tablaLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar clientes', e);
        this.httpErrorHandler.process(e);
        this.tablaLoading = false;
      }
    });
  }

  eliminar(id: number | null): void {
    if(id) this.cliSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Cliente eliminado.')
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar Cliente', e);
        this.httpErrorHandler.process(e);
      }
    })
    /*if (id !== null) {
      this.cliSrv.delete(id).subscribe(() => {
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e) => {
        console.log('Error al eliminar cliente');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.notif.create('error', 'Error al eliminar', e.error);
      });
    }*/
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
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    params = params.appendAll(this.paramsFiltros);
    return params;
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(()=>{
      this.cargarDatos();
    }, 500);
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.cargarDatos();
  }

  calcularCantidadFiltros(){
    let cant: number = 0;
    cant += this.cobradoresSeleccionadosFiltro.length;
    this.cantFiltrosAplicados = cant;
  }

  procesarParamsFiltro(p: IParametroFiltro): void{
    this.paramsFiltros = p;
    this.cargarDatos();
  }

  procesarCantidadFiltros(c: number): void{
    this.cantFiltrosAplicados = c;
  }

  confirmarEliminacion(cliente: Cliente){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el Cliente?',
      nzContent: `«${cliente.id} - ${cliente.razonsocial}»`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(cliente.id);
      }
    });
  }

}
