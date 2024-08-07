import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild } from '@angular/core';
import { SuscripcionesService } from '@services/suscripciones.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';
import { formatNumber } from '@angular/common';
import { LatLngTuple } from 'leaflet';
import { UbicacionComponent } from '@modules/domicilios/components/ubicacion/ubicacion.component';
import { Suscripcion } from '@dto/suscripcion-dto';

@Component({
  selector: 'app-tabla-suscripciones',
  templateUrl: './tabla-suscripciones.component.html',
  styleUrls: ['./tabla-suscripciones.component.scss']
})
export class TablaSuscripcionesComponent implements OnInit {

  @ViewChild(UbicacionComponent)
  ubicacionComp!: UbicacionComponent;

  @Input()
  idcliente: number | null = null;
  @Input()
  mostrarCliente: boolean = false;
  @Output()
  tableLoadingChange = new EventEmitter<boolean>();

  @Input()
  get paramsFiltros(): IParametroFiltro { return this._paramsFiltros };
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = { ...p };
    if (oldParams !== JSON.stringify(p)) {
      /*console.log("Los parametros son distintos");
      console.log(oldParams);
      console.log(JSON.stringify(p));*/
      this.cargarDatos()
    };
  };
  private _paramsFiltros: IParametroFiltro = {};

  timerBusqueda: any;

  @Input()
  get textoBusqueda(): string { return this._textoBusqueda };
  set textoBusqueda(t: string) {
    const oldSearch: string = this._textoBusqueda;
    this._textoBusqueda = t;
    if (oldSearch !== t) {
      clearTimeout(this.timerBusqueda);
      this.timerBusqueda = setTimeout(() => {
        this.cargarDatos();
      }, 500);
    }
  }
  _textoBusqueda: string = '';

  lstSuscripciones: Suscripcion[] = [];
  tableLoading: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 0;
  sortStr: string | null = null;

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  //sortOrders: { [field: string]: string | null } = {}
  srtOrderCliente: string | null = null;
  srtOrderId: string | null = null;

  modalUbicacionVisible: boolean = false;
  ubicacionActual: LatLngTuple | null = null;

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private suscripSrv: SuscripcionesService,
    private notif: NzNotificationService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void { }

  cerrarModalUbicacion(){
    this.modalUbicacionVisible = false;
  }

  mostrarModalUbicacion(ubicacion: LatLngTuple){
    this.ubicacionActual = ubicacion;
    this.modalUbicacionVisible = true;
  }

  cargarDatos(): void {
    console.log('Cargar datos tabla suscripciones')
    this.tableLoading = true;
    this.tableLoadingChange.emit(true);
    forkJoin({
      suscripciones: this.suscripSrv.get(this.getHttpQueryParams()),
      total: this.suscripSrv.getTotal(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstSuscripciones = resp.suscripciones;
        this.total = resp.total;
        this.tableLoading = false;
        this.tableLoadingChange.emit(false);
      },
      error: (e) => {
        console.error('Error al cargar suscripciones', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
        this.tableLoadingChange.emit(false);
      }
    });
  }

  eliminar(id: number | null): void {
    if(id) this.suscripSrv.delete(id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Suscripción eliminada.');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar Suscripcion', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  onTableParamsChange(params: NzTableQueryParams) {
    this.sortStr = Extra.buildSortString(params.sort);
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    this.cargarDatos();
  }

  getHttpQueryParams(): HttpParams {
    const paramsObj: IParametroFiltro = {};
    paramsObj['eliminado'] = 'false';
    if (this.idcliente) paramsObj['idcliente'] = `${this.idcliente}`;
    if (this.textoBusqueda) paramsObj['search'] = this.textoBusqueda;

    var params: HttpParams = new HttpParams();
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex - 1) * this.pageSize);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.appendAll(paramsObj);
    params = params.appendAll(this.paramsFiltros);
    return params;
  }

  confirmarEliminacion(suscripcion: Suscripcion){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar la suscripción?',
      nzContent: `«${suscripcion.id} - ${suscripcion.servicio} (${formatNumber(Number(suscripcion.monto), this.locale)}Gs./mes)»`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(suscripcion.id);
      }
    });
  }

}
