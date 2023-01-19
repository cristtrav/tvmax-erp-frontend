import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UsuariosService } from './../../../servicios/usuarios.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { Usuario } from '@dto/usuario.dto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-usuarios',
  templateUrl: './vista-usuarios.component.html',
  styleUrls: ['./vista-usuarios.component.scss']
})
export class VistaUsuariosComponent implements OnInit {

  lstUsuarios: Usuario[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 1;
  tableLoading: boolean = false;
  sortStr: string | null = '+id';

  constructor(
    private usuariosSrv: UsuariosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
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
    /*this.usuariosSrv.get(this.getHttpQueryParams()).subscribe({
      next: (resp) => {
        this.lstUsuarios = resp.data;
        this.totalRegisters = resp.queryRowCount;
        this.tableLoading = false;
      },
      error: (e) => {
        console.log('Error al consultar usuarios');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.tableLoading = false;
      }
    });*/
  }

  eliminar(id: number | null): void {
    if (id) {
      this.usuariosSrv.delete(id).subscribe(() => {
        this.notif.create('success', 'Usuario eliminado correctamente', '');
        this.cargarDatos();
      }, (e) => {
        console.log('Error al eliminar usuario');
        console.log(e);
        this.httpErrorHandler.handle(e);
        //this.notif.create('error', 'Error al eliminar usuario', e.error);
      });
    }
  }

  getHttpQueryParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if (this.sortStr) {
      params = params.append('sort', this.sortStr);
    }
    return params;
  }

  onTableParamsQueryChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = this.buildSortStr(params.sort);
    this.cargarDatos();
  }

  buildSortStr(sort: { key: string, value: any }[]): string | null {
    for (let s of sort) {
      if (s.value === 'ascend') return `+${s.key}`;
      if (s.value === 'descend') return `-${s.key}`;
    }
    return null;
  }

}
