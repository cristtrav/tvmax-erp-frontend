import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams, NzTableSortOrder } from 'ng-zorro-antd/table';
import { HttpParams } from '@angular/common/http';
import { GruposService } from '@global-services/grupos.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Servicio } from '@dto/servicio-dto';
import { ServiciosService } from '@global-services/servicios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-vista-servicios',
  templateUrl: './vista-servicios.component.html',
  styleUrls: ['./vista-servicios.component.scss']
})
export class VistaServiciosComponent implements OnInit {

  lstServicios: Servicio[] = [];
  totalRegisters: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;
  tableLoading: boolean = false;
  //sortStr: string | null = "+id";
  ordenarPor: string | null = 'id';
  orden: NzTableSortOrder = 'ascend';

  ordenarPorInicial: string | null = null;
  ordenInicial: NzTableSortOrder = null;
  filtroIdGrupoInicial: string[] = [];

  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;
  filtrosGrupoChk: ICheckboxData[] = [];
  textoBusqueda: string = '';
  timerBusqueda: any;

  private readonly sortColumns: string[] = [
    "id",
    "descripcion",
    "grupo",
    "suscribible",
    "precio"
  ];
  
  readonly opNroRegistros: number[] = [10, 20, 30, 40, 50];

  constructor(
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private httpErrorRespSrv: HttpErrorResponseHandlerService,
    private gruposSrv: GruposService,
    private aroute: ActivatedRoute,
    private router: Router,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.procesarParametrosInicialesPagina();
    this.cargarGruposFiltro();    
  }

  private procesarParametrosInicialesPagina(){
    const ordenarPor = this.aroute.snapshot.queryParamMap.get('ordenarPor');
    this.ordenarPorInicial =
      ordenarPor != null && this.sortColumns.includes(ordenarPor)
      ? ordenarPor : 'id';

    const orden = this.aroute.snapshot.queryParamMap.get('orden');
    this.ordenInicial =
      orden == 'ascend' || orden == 'descend'
      ? orden : 'ascend';

    const pagina = Number(this.aroute.snapshot.queryParamMap.get('pagina'));
    this.pageIndex = pagina != null && !Number.isNaN(pagina) && pagina > 0 ? pagina : 1;

    const nroRegistros = Number(this.aroute.snapshot.queryParamMap.get('nroRegistros'));
    this.pageSize =
      !Number.isNaN(nroRegistros) && this.opNroRegistros.includes(nroRegistros)
      ? nroRegistros : this.opNroRegistros[0];

    this.textoBusqueda = this.aroute.snapshot.queryParamMap.get('buscar') ?? '';
    this.filtroIdGrupoInicial = this.aroute.snapshot.queryParamMap.getAll('idgrupo');
  }

  cargarServicios(): void {
    this.tableLoading = true;
    forkJoin({
      servicios: this.serviciosSrv.getServicios(this.getHttpQueryParams()),
      total: this.serviciosSrv.getTotalRegistros(this.getHttpQueryParams())
    })
    .pipe(finalize(() => this.tableLoading = false))
    .subscribe({
      next: (respuesta) => {
        this.lstServicios = respuesta.servicios;
        this.totalRegisters = respuesta.total;
      },
      error: (e) => {
        console.error('Error al cargar servicios', e);
        this.httpErrorRespSrv.process(e);
      }
    });
  }

  private cargarGruposFiltro() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+descripcion');
    this.gruposSrv.getGrupos(params)
    .subscribe({
      next: (grupos) => {
        this.filtrosGrupoChk = grupos.map(grupo => ({
            label: `${grupo.descripcion}`,
            value: `${grupo.id}`,
            checked: this.filtroIdGrupoInicial.includes(`${grupo.id}`)
          })
        );
        this.calcularCantFiltros();
      },
      error: (e) => {
        console.error('Error al cargar grupos', e);
        this.httpErrorRespSrv.process(e);
      }
    });
  }

  confirmarEliminacion(servicio: Servicio){
    this.modal.confirm({
      nzTitle: '¿Desea eliminr el Servicio?',
      nzContent: `${servicio.id} - ${servicio.descripcion} (${servicio.grupo})`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(servicio.id ?? -1)
    })
  }

  eliminar(id: number): void {
    this.serviciosSrv
      .deleteServicio(id)
      .subscribe({
        next: () => {
          this.cargarServicios();
          this.notif.create('success', 'Eliminado correctamente', '');
        },
        error: (e) => {
          console.log('Error al eliminar Servicio', e);
          this.httpErrorRespSrv.process(e);
        }
    });
  }

  onTableQueryParamsChange(params: NzTableQueryParams) {
    this.ordenarPor = params.sort.find(s => s.value != null)?.key ?? null;
    this.orden = params.sort.find(s => s.value != null)?.value ?? null;
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;    
    this.cargarServicios();
  }

  private buildSortStr(ordenarPor: string, orden: NzTableSortOrder): string {
    return `${orden === 'descend' ? '-' : '+'}${ordenarPor}`;
  }

  private getHttpQueryParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    if(this.ordenarPor && this.orden) params = params.append('sort', this.buildSortStr(this.ordenarPor, this.orden));
    
    if (this.filtrosGrupoChk.filter(fg => fg.checked).length > 0)
      params = params.appendAll({
        idgrupo: this.filtrosGrupoChk.filter(fg => fg.checked).map(fg => fg.value)
      });
    
    if (this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    
    this.procesarParametrosNavegacion();
    return params;
  }

  private procesarParametrosNavegacion(){
    const pageQueryParams: Params = {
      pagina: this.pageIndex,
      nroRegistros: this.pageSize
    };

    if(this.ordenarPor && this.orden){      
      pageQueryParams['ordenarPor'] = this.ordenarPor;
      pageQueryParams['orden'] = this.orden;
    }

    if (this.textoBusqueda) pageQueryParams['buscar'] = this.textoBusqueda;

    if (this.filtrosGrupoChk.find(chk => chk.checked))
      pageQueryParams['idgrupo'] = this.filtrosGrupoChk
        .filter(chk => chk.checked)
        .map(chk => chk.value);

    this.router.navigate([], 
      {
        relativeTo: this.aroute,
        queryParams: pageQueryParams,
        replaceUrl: true
      });
  }

  filtroGrupoChange() {
    this.calcularCantFiltros();
    this.cargarServicios();
  }

  limpiarFiltroGrupos() {
    this.filtrosGrupoChk.forEach(chk => chk.checked = false);
    this.calcularCantFiltros();
    this.cargarServicios();
  }

  calcularCantFiltros() {
    let cant = 0;
    if(this.filtrosGrupoChk.find(chk => chk.checked)) cant++
    this.cantFiltrosAplicados = cant;
  }

  buscar() {
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarServicios();
    }, 500);

  }

  limpiarBusqueda() {
    this.textoBusqueda = "";
    this.cargarServicios();
  }
}

interface ICheckboxData {
  label: string,
  value: string,
  checked?: boolean,
  disabled?: boolean
}
