import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MaterialDTO } from '@dto/material.dto';
import { ImpresionService } from '@servicios/impresion.service';
import { MaterialesService } from '@servicios/materiales.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-materiales',
  templateUrl: './vista-materiales.component.html',
  styleUrls: ['./vista-materiales.component.scss']
})
export class VistaMaterialesComponent implements OnInit {

  @ViewChild('iframe')
  iframeComp!: ElementRef<HTMLIFrameElement>;
  
  lstMateriales: MaterialDTO[] = [];
  loadingMateriales: boolean = false;
  
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 0;

  sortStr: string | null = null;
  textoBusqueda: string = '';
  timerBusqueda: any;

  loadingImpresion: boolean = false;

  constructor(
    private materialesSrv: MaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService,
    private impresionSrv: ImpresionService,
    private viewContainerRef: ViewContainerRef
  ){}

  ngOnInit(): void {
    
  }

  cargarDatos(){
    this.loadingMateriales = true;
    forkJoin({
      materiales: this.materialesSrv.get(this.getHttpParams()),
      total: this.materialesSrv.getTotal(this.getHttpParams())
    })
      .pipe(finalize(() => this.loadingMateriales = false))
      .subscribe({
        next: (resp) => {
          this.lstMateriales = resp.materiales;
          this.totalRegisters = resp.total;
        },
        error: (e) => {
          console.error('Error al consultar materiales', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  getHttpParams(): HttpParams{
    let params = new HttpParams()
    .append('eliminado', 'false')
    .append('limit', this.pageSize)
    .append('offset', (this.pageIndex - 1) * this.pageSize);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    if(this.textoBusqueda != '') params = params.append('search', this.textoBusqueda);
    return params;
  }

  onTableQueryChange(tableParams: NzTableQueryParams){
    this.sortStr = Extra.buildSortString(tableParams.sort);
    this.cargarDatos();
  }

  confirmarEliminacion(material: MaterialDTO){
    this.modal.confirm({
      nzTitle: `¿Desea eliminar el Material?`,
      nzContent: `${material.id} - ${material.descripcion}`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(material.id);
      }
    })
  }

  eliminar(id: number){
    this.materialesSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Material eliminado.');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar material');
        this.httpErrorHandler.process(e);
      }
    })
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarDatos();
    }, 250);
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.buscar();
  }

  imprimirReporte(){
    const httpParams = this.getHttpParams();
    const paramsFiltros: IParametroFiltro = {};
    httpParams.keys().forEach(key => {
      const param = httpParams.get(key);
      if(param != null) paramsFiltros[key] = param;
    })
    delete paramsFiltros.sort;
    delete paramsFiltros.offset;
    delete paramsFiltros.limit;
    this.impresionSrv.imprimirReporteMateriales(this.iframeComp, this.viewContainerRef, paramsFiltros)
      .subscribe(loading => this.loadingImpresion = loading);
  }

}
