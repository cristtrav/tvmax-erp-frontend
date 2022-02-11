import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Suscripcion } from './../../../dto/suscripcion-dto';
import { SuscripcionesService } from './../../../servicios/suscripciones.service';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { Extra } from '../../../util/extra';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { GruposService } from '@servicios/grupos.service';
import { ServiciosService } from '@servicios/servicios.service';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzMark, NzMarks } from 'ng-zorro-antd/slider';

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

  textoBusqueda: string = '';
  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;

  lstGruposFiltro: Grupo[] = [];

  lstServiciosFiltro: Servicio[] = [];

  idGruposFiltro: string[] | number[] = [];
  idServiciosFiltro: string[] | number[] = [];

  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  filtroConectado: boolean = false;
  filtroReconectado: boolean = false;
  filtroDesconectado: boolean = false;

  rangoCuotasPendFiltro: number[] = [-1, 13];
  marcasFiltroCuotasPend: NzMarks = {
    '0': '0',
    '12': '12',
    '13': '∞'
  };

  timerFiltroCuotasPend: any;
 
  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  constructor(
    private suscripSrv: SuscripcionesService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private gruposSrv: GruposService,
    private serviciosSrv: ServiciosService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarGruposFiltro();
    this.cargarServiciosFiltro();
  }

  limpiarFiltrosEstados(){
    this.filtroConectado = false;
    this.filtroReconectado = false;
    this.filtroDesconectado = false;
    this.filtrar();
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.fechaFinFiltro) {
      return false;
    }
    const ffd: Date = new Date(this.fechaFinFiltro.getFullYear(), this.fechaFinFiltro.getMonth(), this.fechaFinFiltro.getDate() + 1);
    return startValue.getTime() > ffd.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fechaInicioFiltro) {
      return false;
    }
    const fid: Date = new Date(this.fechaInicioFiltro.getFullYear(), this.fechaInicioFiltro.getMonth(), this.fechaInicioFiltro.getDate()-1);
    return endValue.getTime() <= fid.getTime();
  };

  cargarGruposFiltro(){
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', false);
    params = params.append('sort', '+descripcion');
    this.gruposSrv.getGrupos(params).subscribe((resp: ServerResponseList<Grupo>)=>{
      this.lstGruposFiltro = resp.data;
    }, (e)=>{
      console.log('Error al cargar grupos filtro');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  cargarServiciosFiltro(){
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+descripcion');
    if(this.idGruposFiltro.length > 0){
      this.idGruposFiltro.forEach((idg: number | string)=>{
        params = params.append('idgrupo[]',`${idg}`);
      });
    }
    this.serviciosSrv.getServicios(params).subscribe((resp: ServerResponseList<Servicio>)=>{
      this.lstServiciosFiltro = resp.data;
    }, (e)=>{
      console.log('Error al cargar servicios filtro');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  cambioGrupoFiltro(){
    this.idServiciosFiltro = [];
    this.cargarServiciosFiltro();
    this.filtrar();
  }

  filtrar(){
    this.calcularCantFiltros();
    this.cargarDatos();
  }

  calcularCantFiltros(){
    let cant: number = 0;
    if(this.idGruposFiltro.length !== 0 && this.idServiciosFiltro.length === 0) cant += this.idGruposFiltro.length;
    cant += this.idServiciosFiltro.length;
    if(this.fechaFinFiltro) cant++;
    if(this.fechaFinFiltro) cant++;
    if(this.filtroConectado) cant++;
    if(this.filtroReconectado) cant++;
    if(this.filtroDesconectado) cant++;
    if(this.rangoCuotasPendFiltro[0] !== 0 || this.rangoCuotasPendFiltro[1] !== 13){
      cant ++;
    }
    this.cantFiltrosAplicados = cant;
  }

  limpiarFiltrosGruposServicios(){
    this.idGruposFiltro = [];
    this.idServiciosFiltro = [];
    this.filtrar();
  }

  limpiarFiltrosFechaSuscripcion(){
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.filtrar();
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
    if(this.idGruposFiltro.length !== 0 && this.idServiciosFiltro.length === 0){
      this.idGruposFiltro.forEach((idg: number | string)=>{
        params = params.append('idgrupo[]', `${idg}`);
      });
    }
    if(this.idServiciosFiltro.length > 0){
      this.idServiciosFiltro.forEach((ids: string | number)=>{
        params = params.append('idservicio[]', `${ids}`);
      });
    }
    if(this.fechaInicioFiltro){
      const finiciostr: string = `${this.fechaInicioFiltro.getFullYear()}+${(this.fechaInicioFiltro.getMonth() + 1).toString().padStart(2 ,'0')}-${this.fechaInicioFiltro.getDate().toString().padStart(2, '0')}`;
      params = params.append('fechainiciosuscripcion', finiciostr);
    }
    if(this.fechaFinFiltro){
      const ffinstr: string = `${this.fechaFinFiltro.getFullYear()}+${(this.fechaFinFiltro.getMonth() + 1).toString().padStart(2 ,'0')}-${this.fechaFinFiltro.getDate().toString().padStart(2, '0')}`;
      params = params.append('fechafinsuscripcion', ffinstr);
    }
    if(this.filtroConectado || this.filtroReconectado || this.filtroDesconectado){
      if(this.filtroConectado) params = params.append('estado[]', 'C');
      if(this.filtroReconectado) params = params.append('estado[]', 'R');
      if(this.filtroDesconectado) params = params.append('estado[]', 'D');
    }
    if(this.rangoCuotasPendFiltro[0] !== 0 || this.rangoCuotasPendFiltro[1] !== 13){
      params = params.append('cuotaspendientesdesde', `${this.rangoCuotasPendFiltro[0]}`);
      if(this.rangoCuotasPendFiltro[1] !== 13) params = params.append('cuotaspendienteshasta', `${this.rangoCuotasPendFiltro[1]}`);
    }else{
      console.log('no entra en filtro rangog');
    }
    return params;
  }

  buscar(){

  }

  limpiarFiltroRangoCuotasPendientes(){
    this.rangoCuotasPendFiltro = [0, 13];
    this.filtrar();
  }

  cambioFiltroRango(){
    clearTimeout(this.timerFiltroCuotasPend);
    this.timerFiltroCuotasPend = setTimeout(()=>{
      this.filtrar();
    }, 500);
  }

  formatterTooltipRangoCuotas(value: number): string {
    if(value === 13) return 'Sin límite'
    return `${value}`;
  }

}