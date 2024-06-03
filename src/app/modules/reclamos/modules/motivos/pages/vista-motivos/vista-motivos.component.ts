import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MotivoReclamoDTO } from 'src/app/global/dtos/reclamos/motivo-reclamo.dto';
import { MotivosReclamosService } from 'src/app/global/services/reclamos/motivos-reclamos.service';
import { Extra } from '@global-utils/extra';
import { TableHeaderInterface } from '@global-utils/table-utils/table-header.interface';
import { TableUtils } from '@util/table-utils/table-utils';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Observable, Subscription, debounceTime, forkJoin, of, tap } from 'rxjs';

interface DatosInterface{
  motivos: MotivoReclamoDTO[],
  total: number
}

@Component({
  selector: 'app-vista-motivos',
  templateUrl: './vista-motivos.component.html',
  styleUrls: ['./vista-motivos.component.scss']
})
export class VistaMotivosComponent implements OnInit, OnDestroy {
  
  data$: Observable<DatosInterface> = of({motivos: [], total: 0});
  
  tableHeaders: TableHeaderInterface[] = [
    { key: 'id', description: 'Código', sortOrder: 'descend', sortFn: true },
    { key: 'descripcion', description: 'Descripción', sortOrder: null, sortFn: true },
    { description: 'Acciones', sortOrder: null, sortFn: null }
  ]

  pageSize: number = 10;
  pageIndex: number = 1;
  sortStr: string | null = null;

  textoBusquedaCtrl = new FormControl('');
  busquedaSubscription!: Subscription;

  constructor(
    private motivosSrv: MotivosReclamosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnDestroy(): void {
    this.busquedaSubscription.unsubscribe(); 
  }

  ngOnInit(): void {
    this.loadPageQueries();
    this.busquedaSubscription =
      this.textoBusquedaCtrl.valueChanges
      .pipe(debounceTime(250))
      .subscribe((txt) => {
        this.cargarDatos();
        this.router.navigate([], {
          relativeTo: this.aroute,
          queryParams: { busqueda: txt ? txt : undefined },
          queryParamsHandling: 'merge'
        })
      });
  }

  cargarDatos(){
    this.data$ = forkJoin({
      motivos: this.motivosSrv.get(this.getHttpParams()),
      total: this.motivosSrv.getTotal(this.getHttpParams())
    }).pipe(
      tap(resp => {
        if(this.pageIndex > Math.ceil(resp.total/this.pageSize)) this.pageIndex = 1;
      })
    );
  }

  private getHttpParams(){
    let params = new HttpParams()
    .append('eliminado', false)
    .append('limit', this.pageSize)
    .append('offset', (this.pageIndex - 1) * this.pageSize);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    if(this.textoBusquedaCtrl.value) params = params.append('search', this.textoBusquedaCtrl.value);
    return params;
  }

  onTableParamsChange(params: NzTableQueryParams){
    this.sortStr = Extra.buildSortString(params.sort);
    this.navigatePageQueries();
    this.cargarDatos();
  }

  private loadPageQueries(){
    const pIndex = Number(this.aroute.snapshot.queryParamMap.get('pagina'));
    const pSize = Number(this.aroute.snapshot.queryParamMap.get('nroRegistros'));
    let sortOrder = this.aroute.snapshot.queryParamMap.get('orden');
    let sortColumn = this.aroute.snapshot.queryParamMap.get('ordenarPor');

    if(TableUtils.isSortColumnOrderValid(sortColumn, sortOrder, this.tableHeaders)){
      this.sortStr = `${sortOrder == 'descend' ? '-' : '+'}${sortColumn}`;
      this.tableHeaders = TableUtils.setSortTableHeaders(sortColumn, <NzTableSortOrder>sortOrder, this.tableHeaders);
    }

    this.pageSize = Number.isInteger(pSize) && pIndex != 0 ? pSize : 10;
    this.pageIndex = Number.isInteger(pIndex) && pIndex != 0 ? pIndex : 1;
  }

  private navigatePageQueries(){
    const queryParams: Params = {
      pagina: this.pageIndex,
      nroRegistros: this.pageSize
    }
    if(this.sortStr){
      queryParams['ordenarPor'] = this.sortStr.substring(1)
      queryParams['orden'] = this.sortStr.charAt(0) === '-' ? 'descend' : 'ascend';
    };
    this.router.navigate([], {
      relativeTo: this.aroute,
      queryParams,
      replaceUrl: true      
    });
  }

  confirmarEliminacion(motivo: MotivoReclamoDTO){
    this.modal.confirm({
      nzTitle: `¿Desea eliminar el Motivo de reclamo?`,
      nzContent: `${motivo.id} - ${motivo.descripcion}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(motivo.id)
    })
  }

  eliminar(id: number){
    this.motivosSrv
      .delete(id)
      .subscribe(() => {
        this.notif.success('<strong>Éxito</strong>', 'Motivo de reclamo eliminado.');
        this.cargarDatos();
      });
  }

}
