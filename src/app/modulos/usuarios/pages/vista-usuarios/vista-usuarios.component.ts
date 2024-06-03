import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UsuarioDTO } from '@dto/usuario.dto';
import { forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Extra } from '@util/extra';
import { UsuariosService } from '@global-services/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';

@Component({
  selector: 'app-vista-usuarios',
  templateUrl: './vista-usuarios.component.html',
  styleUrls: ['./vista-usuarios.component.scss']
})
export class VistaUsuariosComponent implements OnInit {

  lstUsuarios: UsuarioDTO[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 1;
  tableLoading: boolean = false;
  sortStr: string | null = '+id';
  expandSet = new Set<number>();
  textoBusqueda: string = '';
  timerBusqueda: any;

  constructor(
    private usuariosSrv: UsuariosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
  }

  confirmarEliminacion(usuario: UsuarioDTO) {
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el Usuario?',
      nzContent: `«${usuario.id} - ${usuario.razonsocial}»`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(usuario);
      }
    });
  }

  cargarRoles(idusuario: number){
    this.usuariosSrv.getRolesByUsuario(idusuario).subscribe({
      next: (roles) => {
        const usu = this.lstUsuarios.find(u => u.id == idusuario)
        if(usu) usu.roles = roles;
      },
      error: (e) => {
        console.error('Error al cargar roles', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  onExpandChange(id: number, checked: boolean) {
    if (checked){
      this.expandSet.add(id);
      this.cargarRoles(id);
    }
    else this.expandSet.delete(id);
  }

  cargarDatos(): void {
    this.tableLoading = true;
    forkJoin({
      usuarios: this.usuariosSrv.get(this.getHttpQueryParams()),
      total: this.usuariosSrv.getTotal(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstUsuarios = resp.usuarios;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar usuarios', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
      }
    })
  }

  eliminar(usuario: UsuarioDTO): void {
    if (usuario.id) this.usuariosSrv.delete(usuario.id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Usuario eliminado');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar usuario', e);
        this.httpErrorHandler.process(e);
      }
    })

  }

  getHttpQueryParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if (this.sortStr) params = params.append('sort', this.sortStr);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

  onTableParamsQueryChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarDatos();
    }, 500);
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.cargarDatos();
  }

}
