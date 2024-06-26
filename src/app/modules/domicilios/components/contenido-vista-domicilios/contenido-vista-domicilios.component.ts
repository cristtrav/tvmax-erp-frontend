import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Extra } from '@global-utils/extra';
import { forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LatLngTuple } from 'leaflet';
import { Domicilio } from '@dto/domicilio-dto';
import { DomiciliosService } from '@services/domicilios.service';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';

@Component({
  selector: 'app-contenido-vista-domicilios',
  templateUrl: './contenido-vista-domicilios.component.html',
  styleUrls: ['./contenido-vista-domicilios.component.scss']
})
export class ContenidoVistaDomiciliosComponent implements OnInit {

  @ViewChild(UbicacionComponent)
  ubicacionComp!: UbicacionComponent;

  lstDomicilios: Domicilio[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;
  sortStr: string | null = '+id';
  tableLoading: boolean = false;
  expandSet = new Set<number>();
  textoBusqueda: string = '';
  timerBusqueda: any;
  ubicacionActual: LatLngTuple | null = null;
  modalUbicacionVisible: boolean = false;

  @Input()
  mostrarTitular: boolean = true;

  @Input()
  idcliente: number | null = null;

  constructor(
    private domiSrv: DomiciliosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService
  ) { }
  
  ngOnInit(): void {
    //this.cargarDatos();
  }

  mostrarModalUbicacion(ubicacion: LatLngTuple){
    this.ubicacionActual = ubicacion;
    this.modalUbicacionVisible = true;
  }

  cerrarModalUbicacion(){
    this.modalUbicacionVisible = false;
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) this.expandSet.add(id);
    else this.expandSet.delete(id);
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarDatos();
    }, 300);
  }

  cargarDatos(): void {
    this.tableLoading = true;
    forkJoin({
      domicilios: this.domiSrv.get(this.getHttpQueryParams()),
      total: this.domiSrv.getTotal(this.getHttpQueryParams())
    }).subscribe({
      next: (resp) => {
        this.lstDomicilios = resp.domicilios;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar domicilios', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
      }
    });
  }

  eliminar(id: number | null): void {
    if (id) this.domiSrv.eliminar(id).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Domicilio eliminado');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar Domicilio', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  getHttpQueryParams(): HttpParams {
    let par: HttpParams = new HttpParams();
    par = par.append('eliminado', 'false');
    if (this.idcliente) par = par.append('idcliente', `${this.idcliente}`);
    if (this.sortStr) par = par.append('sort', this.sortStr);
    par = par.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    par = par.append('limit', `${this.pageSize}`);
    if(this.textoBusqueda) par = par.append('search', this.textoBusqueda);
    return par;
  }

  onTableQueryParamsChange(p: NzTableQueryParams) {
    this.pageIndex = p.pageIndex;
    this.pageSize = p.pageSize;
    this.sortStr = Extra.buildSortString(p.sort);
    this.cargarDatos();
  }

  confirmarEliminacion(domicilio: Domicilio) {
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el domicilio?',
      nzContent: `«${domicilio.id} - ${domicilio.direccion}»`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(domicilio.id);
      }
    })
  }

}
