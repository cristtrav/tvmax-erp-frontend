import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { ClientesService } from '@services/clientes.service';
import { SesionService } from '@services/sesion.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-exclusiones',
  templateUrl: './exclusiones.component.html',
  styleUrls: ['./exclusiones.component.scss']
})
export class ExclusionesComponent implements OnInit {

  lstExcluidos: Cliente[] = [];
  loadingExcluidos: boolean = false;
  pageSizeExcluidos: number = 10;
  pageIndexExcluidos: number = 1;
  totalRegistersExcluidos: number = 0;
  sortStrExcluidos: string | null = null;
  timerBusquedaExcluidos: any;
  textoBusquedaExcluidos: string = '';

  lstClientes: Cliente[] = [];
  loadingClientes: boolean = false;
  pageSizeClientes: number = 10;
  pageIndexClientes: number = 1;
  totalRegistersClientes: number = 0;
  sortStrClientes: string | null = null;
  textoBusquedaClientes: string = '';
  timerBusquedaClientes: any;

  modalClienteVisible: boolean = false;

  constructor(
    private clientesSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private sesionSrv: SesionService,
    private modal: NzModalService
  ){}

  ngOnInit(): void {
    //this.cargarDatos();
  }

  cargarClientes(){
    this.loadingClientes = true;
    forkJoin({
      clientes: this.clientesSrv.get(this.getHttpParamsClientes()),
      total: this.clientesSrv.getTotal(this.getHttpParamsClientes())
    })
    .pipe(finalize(() => this.loadingClientes = false))
    .subscribe({
      next: (resp) => {
        this.lstClientes = resp.clientes;
        this.totalRegistersClientes = resp.total;        
      },
      error: (e) => {
        console.error('Error al cargar clientes', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  cargarExcluidos(){
    if(!this.sesionSrv.permisos.has(521)){
      this.notif.error('<strong>No autorizado</strong>', 'El usuario no tiene permisos para consultar excluidos de sorteos');
      return;
    }
    this.loadingExcluidos = true;
    forkJoin({
      clientes: this.clientesSrv.get(this.getHttpParams()),
      total: this.clientesSrv.getTotal(this.getHttpParams())
    })
    .pipe(finalize(() => this.loadingExcluidos = false))
    .subscribe({
      next: (resp) => {
        this.totalRegistersExcluidos = resp.total;
        this.lstExcluidos = resp.clientes;
      },
      error: (e) => {
        console.error('Error al cargar excluidos', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  getHttpParams(): HttpParams{
    let params = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('excluidosorteo', 'true');
    params = params.append('limit', this.pageSizeExcluidos);
    params = params.append('offset', `${(this.pageIndexExcluidos - 1) * this.pageSizeExcluidos}`);
    if(this.sortStrExcluidos) params = params.append('sort', this.sortStrExcluidos);
    if(this.textoBusquedaExcluidos) params = params.append('search', this.textoBusquedaExcluidos);
    return params;
  }

  getHttpParamsClientes(): HttpParams{
    let params = new HttpParams();
    params = params.append('eliminado', 'false');
    //params = params.append('excluidosorteo', 'false');
    params = params.append('limit', this.pageSizeClientes);
    params = params.append('offset', `${(this.pageIndexClientes - 1) * this.pageSizeClientes}`);
    if(this.sortStrClientes) params = params.append('sort', this.sortStrClientes);
    if(this.textoBusquedaClientes) params = params.append('search', this.textoBusquedaClientes);
    return params;
  }

  onTableQueryParamsChange(tableParams: NzTableQueryParams){
    this.pageIndexExcluidos = tableParams.pageIndex;
    this.pageSizeExcluidos = tableParams.pageSize;
    this.sortStrExcluidos = Extra.buildSortString(tableParams.sort);
    this.cargarExcluidos();
  }

  onTableClientesQueryParamsChange(tableParams: NzTableQueryParams){
    this.pageIndexClientes = tableParams.pageIndex;
    this.pageSizeClientes = tableParams.pageSize;
    this.sortStrClientes = Extra.buildSortString(tableParams.sort);
    this.cargarClientes();
  }

  buscarClientes(){
    clearTimeout(this.timerBusquedaClientes);
    this.timerBusquedaClientes = setTimeout(() => {
      this.cargarClientes();
    }, 250);
  }

  buscarExcluidos(){
    clearTimeout(this.timerBusquedaExcluidos);
    this.timerBusquedaExcluidos = setTimeout(() => {
      this.cargarExcluidos();
    }, 250);
  }

  limpiarBusquedaClientes(){
    this.textoBusquedaClientes = '';
    this.cargarClientes();
  }

  limpiarBusquedaExcluidos(){
    this.textoBusquedaExcluidos = '';
    this.cargarExcluidos();
  }

  private editarCliente(cliente: Cliente){
    this.clientesSrv.put(cliente.id ?? -1, cliente)
    .subscribe({
      next: () => {
        this.cargarClientes();
        this.cargarExcluidos();
      },
      error: (e) => {
        console.error('Error al editar cliente', e);
        this.httpErrorHandler.process(e);
        cliente.excluidosorteo = !cliente.excluidosorteo;
      }
    });
  }

  excluirCliente(cliente: Cliente){
    if(!this.sesionSrv.permisos.has(522)){
      this.notif.error('<strong>No autorizado</strong>', 'El usuario no tiene permisos para agregar exclusiones');
    }else{
      cliente.excluidosorteo = true;
      this.editarCliente(cliente);
    }
  }

  confirmarRevertirExclusion(cliente: Cliente){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar la exclusión?',
      nzContent: `${cliente.id} - ${cliente.razonsocial}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.revertirExclusion(cliente)
    })
  }

  revertirExclusion(cliente: Cliente){
    if(!this.sesionSrv.permisos.has(523)){
      this.notif.error('<strong>No autorizado</strong>', 'El usuario no tiene permisos para eliminar exclusiones');
    }else{
      cliente.excluidosorteo = false;
      this.editarCliente(cliente);
    }
  }

  mostrarModalCliente(){
    this.modalClienteVisible = true;
    this.textoBusquedaClientes = '';
  }

}
