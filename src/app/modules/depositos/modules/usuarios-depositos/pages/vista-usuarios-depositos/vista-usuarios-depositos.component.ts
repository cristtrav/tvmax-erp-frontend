import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RolDTO } from '@dto/rol.dto';
import { UsuarioDTO } from '@dto/usuario.dto';
import { UsuariosService } from '@global-services/usuarios.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin, from, map, mergeMap, of, toArray } from 'rxjs';

interface RolesUsuarioInterface{
  roles: RolDTO[],
  loading: boolean
}

@Component({
  selector: 'app-vista-usuarios-depositos',
  templateUrl: './vista-usuarios-depositos.component.html',
  styleUrls: ['./vista-usuarios-depositos.component.scss']
})
export class VistaUsuariosDepositosComponent implements OnInit {

  lstUsuariosDepositos: UsuarioDTO[] = [];
  totalRegisters: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  loading: boolean = false;
  sortSr: string | null = null;
  textoBusqueda: string = ''
  timerBusqueda: any;
  mapRoles: Map<number, RolDTO[]> = new Map();

  constructor(
    private usuariosSrv: UsuariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
  }

  cargarDatos(){
    this.loading = true;
    forkJoin({
      usuarios: this.usuariosSrv.get(this.getHttpParams()),
      total: this.usuariosSrv.getTotal(this.getHttpParams())
    })
    .pipe(
      mergeMap(respA => {
        return forkJoin({
          usuarios: of(respA.usuarios),
          total: of(respA.total),
          roles: from(respA.usuarios).pipe(
            mergeMap(usuario => {
              return this.usuariosSrv
                .getRolesByUsuario(usuario.id)
                .pipe(
                  mergeMap((roles: RolDTO[]) => of({idusuario: usuario.id, roles})
                )
              )
            }),
            toArray(),
            map(idusuariosRoles => {
              const mapa: Map<number, RolDTO[]> = new Map();
              idusuariosRoles.forEach(idusuariorol => mapa.set(idusuariorol.idusuario, idusuariorol.roles));
              return mapa;
            })
          )
        })
      }),
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: (resp) => {
        this.totalRegisters = resp.total;
        this.lstUsuariosDepositos = resp.usuarios;
        this.mapRoles = resp.roles;
      },
      error: (e) => {
        console.error('Error al cargar usuarios de depositos', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private getHttpParams(): HttpParams{
    let params = new HttpParams();
    params = params.append('idrol', 7);
    params = params.append('idrol', 8);
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

  confirmarEliminacion(usuario: UsuarioDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el usuario de depósito?',
      nzContent: `${usuario.id} - ${usuario.razonsocial}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(usuario.id)
    })
  }

  eliminar(id: number){
    this.usuariosSrv.delete(id).subscribe({
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
