import { Component, OnInit } from '@angular/core';
import { Grupo } from '../../../dto/grupo-dto';
import { GruposService } from '../../../servicios/grupos.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-vista-grupos',
  templateUrl: './vista-grupos.component.html',
  styleUrls: ['./vista-grupos.component.scss']
})
export class VistaGruposComponent implements OnInit {

  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 1;
  sort: string | null  = '+id';
  loadingData: boolean = false;
  lstGrupos: Grupo[] = [];

  constructor(
    private grupoSrv: GruposService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
    ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(){
    this.loadingData = true;
    this.grupoSrv.getGrupos(this.getQueryHttpParams()).subscribe((resp: ServerResponseList<Grupo>)=>{
      this.lstGrupos = resp.data;
      this.totalRegisters = resp.queryRowCount;
      this.loadingData = false;
    }, (e)=>{
      this.loadingData = false;
      console.log(`Error al cargar grupos`);
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  eliminar(id: any): void{
    this.grupoSrv.deleteGrupo(<number>id).subscribe(()=>{
      this.cargarDatos();
      this.notif.create('success', 'Eliminado correctamente', '');
    }, (e)=>{
      console.error(e);
      this.httpErrorHandler.handle(e);
    });
  }

  onQueryParamsChange(params: NzTableQueryParams){
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sort = this.buildSort(params.sort);
    this.cargarDatos();
  }

  buildSort(filters: {key: string, value: any}[]): string | null {
    for(var f of filters){
      if(f.value === 'ascend') return `+${f.key}`;
      if(f.value === 'descend') return `-${f.key}`;
    }
    return null;
  }

  getQueryHttpParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if(this.sort){
      params = params.append('sort', this.sort);
    }
    return params;
  }

}