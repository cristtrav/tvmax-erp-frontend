import { Component, OnInit } from '@angular/core';
import { Grupo } from '../../../dto/grupo-dto';
import { GruposService } from '../../../servicios/grupos.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

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
    var filtersTotal: IFilter[] = [];
    filtersTotal.push({ key: 'eliminado', value: 'false' });
    this.grupoSrv.getTotal(filtersTotal).subscribe((total)=>{
      console
      this.totalRegisters = total;
    }, (e)=>{
      console.log('Error al consultar total de grupos');
      console.log(e);
      this.notif.create('error', 'Error al contar', 'Error al obtener el total de registros');
    });

    this.loadingData = true;
    this.grupoSrv.getGrupos(this.getFilters()).subscribe((data)=>{
      this.lstGrupos = data;
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
    console.log(params);
    this.cargarDatos();
  }

  getFilters(): IFilter[] {
    var filters: IFilter[] = [];
    filters.push({key: 'eliminado', value: 'false'});
    if(this.sort){
      filters.push({ key: 'sort', value: this.sort });
    }
    filters.push({key: 'limit', value: `${this.pageSize}`});
    filters.push({key: 'offset', value: `${(this.pageIndex-1)*this.pageSize}`});
    return filters;
  }

  buildSort(filters: IFilter[]): string | null {
    for(var f of filters){
      if(f.value === 'ascend') return `+${f.key}`
      if(f.value === 'descend') return `-${f.key}`
    }
    return null
  }

}

interface IFilter{
  key: string;
  value: any;
}
