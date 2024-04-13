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
import { Observable, Subscription, debounceTime, forkJoin, of, tap } from 'rxjs';

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
  mapDetallesReclamos = new Map<number, Observable<DetalleReclamoDTO[]>>

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
    if(checked) this.expandSet.add(id);
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
    })
    .pipe(
      tap(resp => {
        this.mapDetallesReclamos.clear();
        resp.reclamos.forEach(reclamo => {
          const params = new HttpParams().append('eliminado', false);
          this.mapDetallesReclamos.set(reclamo.id ?? -1, this.reclamosSrv.getDetallesByReclamo(reclamo.id ?? -1, params));
        })
      })
    );
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
