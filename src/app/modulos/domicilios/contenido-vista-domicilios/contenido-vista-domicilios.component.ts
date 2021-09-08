import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ServerResponseList } from 'src/app/dto/server-response-list.dto';
import { Domicilio } from './../../../dto/domicilio-dto';
import { DomiciliosService } from './../../../servicios/domicilios.service';
import { HttpErrorResponseHandlerService } from 'src/app/util/http-error-response-handler.service';
import { Extra } from 'src/app/util/extra';

@Component({
  selector: 'app-contenido-vista-domicilios',
  templateUrl: './contenido-vista-domicilios.component.html',
  styleUrls: ['./contenido-vista-domicilios.component.scss']
})
export class ContenidoVistaDomiciliosComponent implements OnInit {

  lstDomicilios: Domicilio[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;
  sortStr: string | null = '+id';
  tableLoading: boolean = false;

  @Input()
  idcliente: number | null = null;

  constructor(
    private domiSrv: DomiciliosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    console.log(`idcliente en contenido vista domicilios> ${this.idcliente}`);
    this.cargarDatos();
  }

  private cargarDatos(): void{
    this.tableLoading = true;    
    this.domiSrv.get(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<Domicilio>)=>{
      this.lstDomicilios = resp.data;
      this.totalRegisters = resp.queryRowCount;
      this.tableLoading = false;
    }, (e)=>{
      console.log(e);
      this.tableLoading = false;
      this.httpErrorHandler.handle(e);
    });
  }

  eliminar(id: number | null): void {
    if(id!==null){
      this.domiSrv.eliminar(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar domicilio');
        console.log(e)
        this.httpErrorHandler.handle(e);
      });
    }
  }

  getHttpQueryParams(): HttpParams {
    var par: HttpParams = new HttpParams();
    if(this.idcliente){
      par = par.append('idcliente', `${this.idcliente}`);
    }
    par = par.append('eliminado', 'false');
    if(this.sortStr){
      par = par.append('sort', this.sortStr);
    }
    par = par.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    par = par.append('limit', `${this.pageSize}`);
    return par;
  }

  onTableQueryParamsChange(p: NzTableQueryParams){
    this.pageIndex = p.pageIndex;
    this.pageSize = p.pageSize;
    this.sortStr = Extra.buildSortString(p.sort);
    this.cargarDatos();
  }

}
