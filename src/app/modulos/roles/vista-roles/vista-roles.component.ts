import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RolDTO } from '@dto/rol.dto';
import { RolesService } from '@servicios/roles.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.scss']
})
export class VistaRolesComponent implements OnInit {

  listaRoles: RolDTO[] = [];
  totalRegisters: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;
  sortStr: string | null = '+id'; 
  tableLoading: boolean = false;
  textoBusqueda: string = ''
  timerBusqueda: any;

  constructor(
    private rolesSrv: RolesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarRoles();
  }

  private cargarRoles(){
    this.tableLoading = true;
    forkJoin({
      roles: this.rolesSrv.get(this.getHttpParams()),
      total: this.rolesSrv.getTotal(this.getHttpParams())
    }).subscribe({
      next: (resp) => {
        this.listaRoles = resp.roles;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar roles', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
      }
    })
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarRoles();
  }

  private getHttpParams(): HttpParams{
    let params = new HttpParams();
    params = params.append('eliminado', 'false');
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex-1) * this.pageSize)
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

  confirmarEliminacion(rol: RolDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el Rol?',
      nzContent: `«${rol.id} - ${rol.descripcion}»`,
      nzOnOk: () => {
        this.rolesSrv.delete(rol.id).subscribe({
          next: () => {
            this.notification.create('success', '<strong>Éxito</strong>', `Rol eliminado`)
            this.cargarRoles();
          },
          error: (e) => {
            console.error('Error al eliminar rol', e);
            this.httpErrorHandler.process(e);
          }
        })
      },
      nzOkText: 'Eliminar',
      nzOkDanger: true
    });
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarRoles();
    }, 500);
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.cargarRoles();
  }

}
