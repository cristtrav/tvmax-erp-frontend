import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Suscripcion } from './../../../dto/suscripcion-dto';
import { SuscripcionesService } from './../../../servicios/suscripciones.service';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { Extra } from '../../../util/extra';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzDrawerOptions, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-contenido-vista-suscripciones',
  templateUrl: './contenido-vista-suscripciones.component.html',
  styleUrls: ['./contenido-vista-suscripciones.component.scss']
})
export class ContenidoVistaSuscripcionesComponent implements OnInit {

  @Input()
  idcliente: number | null = null;
  @Input()
  mostrarCliente: boolean = false;

  lstSuscripciones: Suscripcion[] = [];
  tableLoading: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 0;
  sortStr: string | null = '+cliente';

  paramsFiltros: IParametroFiltro = {};

  textoBusqueda: string = '';
  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;

  timerBusqueda: any;

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  drawerFilt: NzDrawerRef | null = null;

  constructor(
    private suscripSrv: SuscripcionesService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private drawer: NzDrawerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void{
    this.tableLoading = true;
    
    this.suscripSrv.get(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<Suscripcion>)=>{
      this.lstSuscripciones = resp.data;
      this.total = resp.queryRowCount;
      this.tableLoading = false;
    }, (e)=>{
      console.log('Error al cargar suscripciones');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.tableLoading = false;
    });
  }

  eliminar(id: number | null): void {
    if(id){
      this.suscripSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Suscripción eliminada correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar suscripcion');
        console.log(e);
        this.httpErrorHandler.handle(e);;
      });
    }
  }

  onTableParamsChange(params: NzTableQueryParams){
    this.sortStr = Extra.buildSortString(params.sort);
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex
    this.cargarDatos();
  }

  getHttpQueryParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    if(this.idcliente) params = params.append('idcliente', `${this.idcliente}`);
    params = params.appendAll(this.paramsFiltros);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarDatos();
    }, 500);
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.cargarDatos();
  }

  procesarHttpParamsFiltro(params: IParametroFiltro){
    this.paramsFiltros = params;
    this.cargarDatos();
  }

  procesarCantidadFiltros(cant: number){
    this.cantFiltrosAplicados = cant;
  }
  
  mostrarOcultarDrawer(){
    
    const options: NzDrawerOptions =  { nzClosable: true, nzTitle: 'El Filtro'};
    this.drawerFilt = this.drawer.create(options);
  }

}