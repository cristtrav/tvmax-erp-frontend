import { Component, OnInit } from '@angular/core';
import { Grupo } from '../../../dto/grupo-dto';
import { GruposService } from '../../../servicios/grupos.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';

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
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  private cargarDatos() {
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

  eliminar(id: any): void {
    this.grupoSrv.deleteGrupo(<number>id).subscribe(() => {
      this.cargarDatos();
      this.notif.create('success', 'Eliminado correctamente', '');
    }, (e) => {
      console.error(e);
      this.httpErrorHandler.handle(e);
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sort = this.buildSort(params.sort);
    this.cargarDatos();
  }

  buildSort(filters: { key: string, value: any }[]): string | null {
    for (var f of filters) {
      if (f.value === 'ascend') return `+${f.key}`;
      if (f.value === 'descend') return `-${f.key}`;
    }
    return null;
  }

  getQueryHttpParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if (this.sort) {
      params = params.append('sort', this.sort);
    }
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