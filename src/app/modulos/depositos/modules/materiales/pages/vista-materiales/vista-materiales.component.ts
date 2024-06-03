import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MaterialIdentificableDTO } from '@dto/depositos/material-identificable.dto';
import { MaterialDTO } from '@dto/depositos/material.dto';
import { MaterialesService } from '@global-services/depositos/materiales.service';
import { ImpresionService } from '@global-services/impresion.service';
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
  expandSet = new Set<number>();
  mapIdentificablesMeta = new Map<number, IdentificablesMetadataInterface>();

  drawerFiltrosVisible: boolean = false;
  cantFiltros: number = 0;
  paramFiltros: IParametroFiltro = {};

  constructor(
    private materialesSrv: MaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService,
    private impresionSrv: ImpresionService,
    private viewContainerRef: ViewContainerRef
  ){}

  ngOnInit(): void { }

  openDrawerFiltros(){
    this.drawerFiltrosVisible = true;
  }

  closeDrawerFiltros(){
    this.drawerFiltrosVisible = false;
  }

  onExpandChange(id: number, checked: boolean){
    if(checked){
      this.expandSet.add(id);
      this.cargarIdentificables(id, this.mapIdentificablesMeta.get(id)?.mostrarNoDisponibles ?? false);
    } else this.expandSet.delete(id);
  }

  cargarDatos(){
    this.mapIdentificablesMeta.clear();
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
          this.lstMateriales.forEach(m => this.mapIdentificablesMeta.set(m.id, {
            lstMaterialesIdentificables: [],
            loading: false,
            pageIndex: 1,
            pageSize: 10,
            totalRegisters: 0,
            mostrarNoDisponibles: false
          }));
        },
        error: (e) => {
          console.error('Error al consultar materiales', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  filtrar(paramsFiltros: IParametroFiltro){
    this.paramFiltros = paramsFiltros;
    this.cargarDatos();
  }

  getHttpParams(): HttpParams{
    let params = new HttpParams()
    .append('eliminado', 'false')
    .append('limit', this.pageSize)
    .append('offset', (this.pageIndex - 1) * this.pageSize)
    .appendAll(this.paramFiltros);
    
    if(this.sortStr) params = params.append('sort', this.sortStr);
    if(this.textoBusqueda != '') params = params.append('search', this.textoBusqueda);
    return params;
  }

  cargarIdentificables(idmaterial: number, mostrarNoDisponibles: boolean){
    const identMeta = this.mapIdentificablesMeta.get(idmaterial);
    if(identMeta == null) return;

    let params = new HttpParams()
    .append('limit', identMeta.pageSize)
    .append('offset', (identMeta.pageIndex - 1) * identMeta.pageSize);

    if(!mostrarNoDisponibles) params = params.append('disponible', true);
    identMeta.mostrarNoDisponibles = mostrarNoDisponibles;
    
    if(identMeta.sortStr) params = params.append('sort', identMeta.sortStr);
    identMeta.loading = true;
    forkJoin({
      identificables: this.materialesSrv.getMaterialIdentificableByMaterial(idmaterial, params),
      total: this.materialesSrv.getTotalMaterialesIdentificablesByMaterial(idmaterial, params)
    })
    .pipe(finalize(() => identMeta.loading = false))
    .subscribe({
      next: (resp) => {
        identMeta.totalRegisters = resp.total;
        identMeta.lstMaterialesIdentificables = resp.identificables;
      },
      error: (e) => {
        console.error('Error al cargar datos de material identificable', e);
        this.httpErrorHandler.process(e);
      }
    })
  }  

  onTableIdentificablesQueryChange(idmaterial: number, tableParams: NzTableQueryParams){
    const identificableMeta = this.mapIdentificablesMeta.get(idmaterial);
    if(identificableMeta == null) return;

    identificableMeta.pageSize = tableParams.pageSize;
    identificableMeta.pageIndex = tableParams.pageIndex;    
    identificableMeta.sortStr = Extra.buildSortString(tableParams.sort) ?? undefined;
    this.cargarIdentificables(idmaterial, identificableMeta.mostrarNoDisponibles);
  }

  onTableQueryChange(tableParams: NzTableQueryParams){
    this.pageSize = tableParams.pageSize;
    this.pageIndex = tableParams.pageIndex;
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
    const paramsFiltros: IParametroFiltro = {...this.paramFiltros};
    if(this.textoBusqueda) paramsFiltros['search'] = this.textoBusqueda;
    this.impresionSrv.imprimirReporteMateriales(
      this.iframeComp,
      this.viewContainerRef, paramsFiltros)
      .subscribe(loading => this.loadingImpresion = loading);
  }

}

interface IdentificablesMetadataInterface{
  lstMaterialesIdentificables: MaterialIdentificableDTO[];
  pageIndex: number;
  pageSize: number;
  totalRegisters: number;
  loading: boolean;
  sortStr?: string;
  mostrarNoDisponibles: boolean;
}
