import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Grupo } from '@dto/grupo-dto';
import { GruposService } from '@services/grupos.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Extra } from '@util/extra';

@Component({
  selector: 'app-vista-grupos',
  templateUrl: './vista-grupos.component.html',
  styleUrls: ['./vista-grupos.component.scss']
})
export class VistaGruposComponent implements OnInit {

  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 1;
  sort: string | null = '+id';
  loadingData: boolean = false;
  lstGrupos: Grupo[] = [];
  timerBusqueda: any;
  textoBusqueda: string = '';

  constructor(
    private grupoSrv: GruposService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  cargarDatos() {
    this.loadingData = true;
    forkJoin({
      grupos: this.grupoSrv.getGrupos(this.getQueryHttpParams()),
      count: this.grupoSrv.getTotal(this.getQueryHttpParams())
    }).subscribe({
      next: (respuesta) => {
        this.lstGrupos = respuesta.grupos;
        this.totalRegisters = respuesta.count;
        this.loadingData = false;
      },
      error: (e) => {
        console.error('Error al cargar grupos', e);
        this.httpErrorHandler.process(e);
        this.loadingData = false;
      }
    });
  }

  confirmarEliminacion(grupo: Grupo){
    this.modal.confirm({
      nzTitle: `¿Desea eliminar el grupo?`,
      nzContent: `${grupo.id} - ${grupo.descripcion}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(grupo.id ?? -1)
    })
  }

  eliminar(id: number): void {
    this.grupoSrv
      .deleteGrupo(id)
      .subscribe({
        next: () => {
          this.cargarDatos();
          this.notif.create('success', 'Eliminado correctamente', '');
        },
        error: (e) => {
          console.error('Error al eliminar grupo', e);
          this.httpErrorHandler.process(e);
        }, 
      });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sort = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  getQueryHttpParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if (this.sort) params = params.append('sort', this.sort);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

  buscar() {
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