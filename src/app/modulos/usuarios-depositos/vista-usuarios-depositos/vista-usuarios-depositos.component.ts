import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsuarioDepositoDTO } from '@dto/usuario-deposito.dto';
import { UsuariosDepositosService } from '@servicios/usuarios-depositos.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-usuarios-depositos',
  templateUrl: './vista-usuarios-depositos.component.html',
  styleUrls: ['./vista-usuarios-depositos.component.scss']
})
export class VistaUsuariosDepositosComponent implements OnInit {

  lstUsuariosDepositos: UsuarioDepositoDTO[] = [];
  totalRegisters: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  loading: boolean = false;
  sortSr: string | null = null;
  textoBusqueda: string = ''
  timerBusqueda: any;

  constructor(
    private usuariosDepositosSrv: UsuariosDepositosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {

  }

  cargarDatos(){
    this.loading = true;
    forkJoin({
      usuarios: this.usuariosDepositosSrv.get(this.getHttpParams()),
      total: this.usuariosDepositosSrv.getTotal(this.getHttpParams())
    })
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (resp) => {
        console.log(resp);
        this.totalRegisters = resp.total;
        this.lstUsuariosDepositos = resp.usuarios;
      },
      error: (e) => {
        console.error('Error al cargar usuarios de depositos', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private getHttpParams(): HttpParams{
    let params = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex - 1) * this.pageSize);
    if(this.sortSr) params = params.append('sort', this.sortSr);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

  onTableQueryParamsChange(tableParams: NzTableQueryParams){
    this.pageSize = tableParams.pageSize;
    this.pageIndex = tableParams.pageIndex;
    this.sortSr = Extra.buildSortString(tableParams.sort);
    this.cargarDatos();
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.cargarDatos();
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarDatos();
    }, 250);
  }

  confirmarEliminacion(usuario: UsuarioDepositoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el usuario de depósito?',
      nzContent: `${usuario.id} - ${usuario.razonsocial}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(usuario.id)
    })
  }

  eliminar(id: number){
    this.usuariosDepositosSrv.delete(id).subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Usuario de depósito eliminado');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar usuario de deposito', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

}
