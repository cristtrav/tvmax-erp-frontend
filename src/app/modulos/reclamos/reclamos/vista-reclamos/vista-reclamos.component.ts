import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DetalleReclamoDTO } from 'src/app/global/dtos/reclamos/detalle-reclamo.dto';
import { ReclamoDTO } from 'src/app/global/dtos/reclamos/reclamo.dto';
import { ReclamosService } from 'src/app/global/services/reclamos/reclamos.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { TableHeaderInterface } from '@util/table-utils/table-header.interface';
import { TableUtils } from '@util/table-utils/table-utils';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription, debounceTime, finalize, forkJoin, of } from 'rxjs';
import { MaterialUtilizadoDTO } from '@global-dtos/reclamos/material-utilizado.dto';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { EventoCambioEstadoDTO } from '@global-dtos/reclamos/evento-cambio-estado.dto';

interface DataInterface{
  reclamos: ReclamoDTO[],
  total: number
}

@Component({
  selector: 'app-vista-reclamos',
  templateUrl: './vista-reclamos.component.html',
  styleUrls: ['./vista-reclamos.component.scss']
})
export class VistaReclamosComponent implements OnInit {

  detalleSizes: ResponsiveSizes = { nzXs: 24, nzSm: 24, nzMd: 24, nzLg: 24, nzXl: 10, nzXXl: 10 };
  tabsDetallesSizes: ResponsiveSizes = { nzXs: 24, nzSm: 24, nzMd: 24, nzLg: 24, nzXl: 14, nzXXl: 14 };

  tableHeaders: TableHeaderInterface[] = [
    { key: 'id', description: 'Código', sortFn: true, sortOrder: 'descend' },
    { key: 'fecha', description: 'Fecha', sortFn: true, sortOrder: null },
    { key: 'cliente', description: 'Cliente', sortFn: true, sortOrder: null },
    { key: 'idsuscripcion', description: 'Suscripción', sortFn: true, sortOrder: null},
    { key: 'estado', description: 'Estado', sortFn: true, sortOrder: null },
    { key: 'usuarioresponsable', description: 'Responsable', sortFn: true, sortOrder: null }    
  ];

  reclamos$: Observable<DataInterface> = of({reclamos: [], total: 0});
  busquedaCtrl = new FormControl<string>('');
  busquedaSuscription!: Subscription;  
  pageIndex: number = 1;
  pageSize: number = 10;

  expandSet = new Set<number>();
  mapDetallesReclamos = new Map<number, { loading: boolean, detalles: DetalleReclamoDTO[]}>();
  mapMaterialesUtilizados = new Map<number, { loading: boolean, materiales: MaterialUtilizadoDTO[]}>();
  mapEventosCambiosEstados = new Map<number, {loading: boolean, eventos: EventoCambioEstadoDTO[]}>();

  drawerFiltrosVisible: boolean = false;
  parametrosFiltros: IParametroFiltro = {};
  cantidadFiltros: number = 0;
  
  constructor(
    private reclamosSrv: ReclamosService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    this.busquedaSuscription = 
      this.busquedaCtrl
        .valueChanges
        .pipe(debounceTime(250))
        .subscribe(() => this.cargarDatos());
  }

  onExpandChange(id: number, checked: boolean){
    if(checked){
      this.expandSet.add(id);
      const params = new HttpParams().append('eliminado', false);
      //this.mapDetallesReclamos.set(id, this.reclamosSrv.getDetallesByReclamo(id, params));
      //this.mapMaterialesUtilizados.set(id, this.reclamosSrv.getMaterialesUtilizados(id, params));
      this.cargarDetalles(id);
      this.cargarMateriales(id);
      this.cargarEventosCambiosEstados(id);
    }
    else this.expandSet.delete(id);
  }

  filtrar(params: IParametroFiltro){
    this.parametrosFiltros = params;
    this.cargarDatos();
  }

  abrirDrawerFiltros(){ this.drawerFiltrosVisible = true }

  cerrarDrawerFiltros(){ this.drawerFiltrosVisible = false }

  cargarDatos(){
    this.reclamos$ = forkJoin({
      reclamos: this.reclamosSrv.get(this.getHttpParams()),
      total: this.reclamosSrv.getTotal(this.getHttpParams())
    });
  }

  recargarDatos(){
    this.cargarDatos();
    this.expandSet.forEach(idreclamo => {
      this.cargarDetalles(idreclamo);
      this.cargarMateriales(idreclamo);
      this.cargarEventosCambiosEstados(idreclamo);
    })
  }

  private cargarDetalles(idreclamo: number) {
    const detallesData = this.mapDetallesReclamos.get(idreclamo);
    this.mapDetallesReclamos.set(idreclamo, {loading: true, detalles: detallesData?.detalles ?? []});
    this.reclamosSrv
      .getDetallesByReclamo(idreclamo, new HttpParams().append('eliminado', false))
      .pipe(finalize(() => {
        const detallesData = this.mapDetallesReclamos.get(idreclamo);
        if(detallesData) this.mapDetallesReclamos.set(idreclamo, {loading: false, detalles: detallesData.detalles});
      }))
      .subscribe((detalles) => {
        const detallesData = this.mapDetallesReclamos.get(idreclamo);
        if(detallesData) this.mapDetallesReclamos.set(idreclamo, {loading: detallesData.loading, detalles});
      })
  }

  private cargarMateriales(idreclamo: number) {
    const materialesData = this.mapMaterialesUtilizados.get(idreclamo);
    this.mapMaterialesUtilizados.set(idreclamo, { loading: true, materiales: materialesData?.materiales ?? []});
    this.reclamosSrv
      .getMaterialesUtilizados(idreclamo, new HttpParams().append('eliminado', false))
      .pipe(finalize(() => {
        const materialesData = this.mapMaterialesUtilizados.get(idreclamo);
        if(materialesData) this.mapMaterialesUtilizados.set(idreclamo, { loading: false, materiales: materialesData.materiales })
      }))
    .subscribe((materiales) => {
      const materialesData = this.mapMaterialesUtilizados.get(idreclamo);
      if(materialesData) this.mapMaterialesUtilizados.set(idreclamo, { loading: materialesData.loading, materiales: materiales});
    })
  }

  private cargarEventosCambiosEstados(idreclamo: number) {
    const eventoData = this.mapEventosCambiosEstados.get(idreclamo);
    this.mapEventosCambiosEstados.set(idreclamo, {loading: true, eventos: eventoData?.eventos ?? []});
    this.reclamosSrv
      .getEventosCambiosEstados(idreclamo)
      .pipe(finalize(() => {
        const eventosData = this.mapEventosCambiosEstados.get(idreclamo);
        if(eventosData) this.mapEventosCambiosEstados.set(idreclamo, { loading: false, eventos: eventosData.eventos})
      }))
      .subscribe((eventos) => {
        const eventosData = this.mapEventosCambiosEstados.get(idreclamo);
        if(eventosData) this.mapEventosCambiosEstados.set(idreclamo, { loading: eventosData.loading, eventos});
      })
  }

  limpiarBusqueda(){ this.busquedaCtrl.reset() }

  getHttpParams(): HttpParams{
    let params = new HttpParams().append('eliminado', false);
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex - 1) * this.pageSize);
    params = TableUtils.addSortToHttp(params, this.tableHeaders);
    params = params.appendAll(this.parametrosFiltros);
    if(this.busquedaCtrl.value) params = params.append('search', this.busquedaCtrl.value);
    return params;
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.cargarDatos();
  }

  confirmarEliminacion(reclamo: ReclamoDTO){
    this.modal.confirm({
      nzTitle: `¿Desea eliminar el reclamo?`,
      nzContent: `Código: ${reclamo.id}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(reclamo.id ?? -1)
    })
  }

  eliminar(idreclamo: number){
    this.reclamosSrv.delete(idreclamo).subscribe(() => {
      this.notif.success('<strong>Éxito</strong>', 'Reclamo eliminado.');
      this.cargarDatos();
    })
  }

}
