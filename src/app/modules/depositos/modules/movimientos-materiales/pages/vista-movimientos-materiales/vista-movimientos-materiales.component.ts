import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DetalleMovimientoMaterialDTO } from '@dto/depositos/detalle-movimiento-material.dto';
import { MovimientoMaterialDTO } from '@dto/depositos/movimiento-material.dto';
import { MovimientosMaterialesService } from '@global-services/depositos/movimientos-materiales.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-movimientos-materiales',
  templateUrl: './vista-movimientos-materiales.component.html',
  styleUrls: ['./vista-movimientos-materiales.component.scss']
})
export class VistaMovimientosMaterialesComponent implements OnInit {

  lstMovimientos: MovimientoMaterialDTO[] = [];
  loadingDatos: boolean = false;
  sortStr: string | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 0;

  expandSet: Set<number> = new Set<number>();
  mapDetallesMovimientos = new Map<number, IDetallesMovimientos>();

  ultimoIdMovimiento: number = 0;
  drawerFiltrosVisible: boolean = false;
  cantidadFiltros: number = 0;
  paramsFiltros: IParametroFiltro = {};

  textoBusqueda: string = '';
  timerBusqueda: any;

  constructor(
    private movimientosMaterialesSrv: MovimientosMaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){ }
  
  ngOnInit(): void {
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.buscar();
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarDatos();
    }, 250);
  }

  filtrar(filtros: IParametroFiltro){
    this.paramsFiltros = filtros;
    this.cargarDatos();
  }

  cerrarDrawerFiltros(){
    this.drawerFiltrosVisible = false;
  }

  mostrarDrawerFiltros(){
    this.drawerFiltrosVisible = true;
  }

  onExpandChange(id: number, checked: boolean){
    if(checked){
      this.expandSet.add(id);
      this.cargarDatosDetalles(id);
    }
    else this.expandSet.delete(id);
  }

  cargarDatos(){
    this.loadingDatos = true;
    this.mapDetallesMovimientos.clear();
    forkJoin({
      movimientos: this.movimientosMaterialesSrv.get(this.getHttpParams()),
      total: this.movimientosMaterialesSrv.getTotal(this.getHttpParams()),
      lastid: this.movimientosMaterialesSrv.getLastId(new HttpParams().append('eliminado', 'false'))
    })
      .pipe(finalize(() => this.loadingDatos = false))
      .subscribe({
        next: (resp) => {
          this.ultimoIdMovimiento = resp.lastid;
          this.lstMovimientos = resp.movimientos;
          resp.movimientos.forEach(movimiento => {
            this.mapDetallesMovimientos.set(movimiento.id, {
              loadingDetalles: false,
              detalles: []
            });
          });
          this.totalRegisters = resp.total;
        },
        error: (e) => {
          console.error('Error al cargar movimientos de materiales', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private getHttpParams(): HttpParams{
    let params = new HttpParams()
      .append('eliminado', 'false')
      .append('limit', `${this.pageSize}`)
      .append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    params = params.appendAll(this.paramsFiltros);
    return params;
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  private cargarDatosDetalles(idmovimiento: number){
    const params = new HttpParams().append('eliminado', 'false');
    const detalle = this.mapDetallesMovimientos.get(idmovimiento);
    if(detalle){
      detalle.loadingDetalles = true;
      this.mapDetallesMovimientos.set(idmovimiento, detalle); 
    }
    this.movimientosMaterialesSrv.getDetallesPorIdMovimiento(idmovimiento, params)
      .pipe(finalize(() => {
        const detalle = this.mapDetallesMovimientos.get(idmovimiento);
        if(detalle){
          detalle.loadingDetalles = false;
          this.mapDetallesMovimientos.set(idmovimiento, detalle); 
        }
      }))
      .subscribe({
        next: (detallesMovimientos) => {
          const detalle = this.mapDetallesMovimientos.get(idmovimiento);
          if(detalle){
            detalle.detalles = detallesMovimientos;
            this.mapDetallesMovimientos.set(idmovimiento, detalle)
          }
        },
        error: (e) => {
          console.error('Error al cargar los detalles de movimientos de materiales', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  confirmarEliminacion(movimiento: MovimientoMaterialDTO){
    this.modal.create({
      nzTitle: 'Confirmar eliminación',
      nzContent: `¿Desea eliminar el movimiento de material con código «${movimiento.id}»?`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(movimiento.id)
    })
  }

  eliminar(id: number){
    this.movimientosMaterialesSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Eliminado correctamente');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar movimiento de material', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  eliminable(movimiento: MovimientoMaterialDTO): boolean{
    if(movimiento.tipomovimiento === 'SA' && movimiento.devuelto) return false;
    if(movimiento.tipomovimiento === 'AJ' && movimiento.id != this.ultimoIdMovimiento) return false;
    return true;
  }

  getTooltipEliminar(movimiento: MovimientoMaterialDTO): string{
    if(movimiento.tipomovimiento === 'SA' && movimiento.devuelto) return 'El movimiento tiene registrado devolución';
    if(movimiento.tipomovimiento === 'AJ' && movimiento.id != this.ultimoIdMovimiento) return 'Existen otros movimientos posteriores a este ajuste';
    return 'Eliminar...';
  }

  getTooltipDevolucion(movimiento: MovimientoMaterialDTO): string{
    if(movimiento.tipomovimiento == 'SA' && movimiento.devuelto) return 'Ya se registró la devolución.'
    if(movimiento.tipomovimiento == 'SA' && !movimiento.devuelto) return 'Registrar devolución.'
    return 'Devolución no aplicable a este tipo de movimiento.'
  }

  devolvible(movimiento: MovimientoMaterialDTO): boolean{
    if(movimiento.tipomovimiento == 'SA' && !movimiento.devuelto) return true;
    return false;
  }

  editable(movimiento: MovimientoMaterialDTO): boolean {
    if(movimiento.tipomovimiento == 'SA' && movimiento.devuelto) return false
    if(movimiento.tipomovimiento == 'AJ' && movimiento.id < this.ultimoIdMovimiento) return false;
    return true;
  }

  getTooltipEditar(movimiento: MovimientoMaterialDTO): string {
    if(movimiento.tipomovimiento == 'SA' && movimiento.devuelto) return 'El movimiento tiene registrado devolución';
    if(movimiento.tipomovimiento == 'AJ' && movimiento.id < this.ultimoIdMovimiento) return 'Existen otros movimientos posteriores a este ajuste';
    return 'Editar'
  }

}

interface IDetallesMovimientos{
  loadingDetalles: boolean;
  detalles: DetalleMovimientoMaterialDTO[];
}
