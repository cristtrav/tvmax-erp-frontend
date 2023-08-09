import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { Servicio } from './../../../dto/servicio-dto';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpParams } from '@angular/common/http';
import { GruposService } from '@servicios/grupos.service';
import { forkJoin } from 'rxjs';

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
  sortStr: string | null = "+id";

  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;
  filtrosGrupoChk: ICheckboxData[] = [];
  textoBusqueda: string = '';
  timerBusqueda: any;

  constructor(
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private httpErrorRespSrv: HttpErrorResponseHandlerService,
    private gruposSrv: GruposService
  ) { }

  ngOnInit(): void {
    //this.cargarServicios();
    this.cargarGruposFiltro();
  }

  private cargarServicios(): void {
    this.tableLoading = true;
    forkJoin({
      servicios: this.serviciosSrv.getServicios(this.getHttpQueryParams()),
      total: this.serviciosSrv.getTotalRegistros(this.getHttpQueryParams())
    }).subscribe({
      next: (respuesta) => {
        this.lstServicios = respuesta.servicios;
        this.totalRegisters = respuesta.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar servicios', e);
        this.httpErrorRespSrv.process(e);
        this.tableLoading = false;
      }
    });
  }

  cargarGruposFiltro() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+descripcion');
    this.gruposSrv.getGrupos(params).subscribe({
      next: (grupos) => {
        const gruposChkbox: ICheckboxData[] = [];
        for (let g of grupos) {
          gruposChkbox.push(
            {
              label: `${g.descripcion}`,
              value: `${g.id}`
            }
          );
        }
        this.filtrosGrupoChk = gruposChkbox;
      },
      error: (e) => {
        console.error('Error al cargar grupos', e);
        this.httpErrorRespSrv.process(e);
      }
    });
  }

  eliminar(id: number | null): void {
    if (id !== null) {
      this.serviciosSrv.deleteServicio(id).subscribe(() => {
        this.cargarServicios();
        this.notif.create('success', 'Eliminado correctamente', '');
      }, (e) => {
        console.log('Error al eliminar Servicio');
        console.log(e);
        this.httpErrorRespSrv.handle(e);
      });
    }
  }

  onTableQueryParamsChange(params: NzTableQueryParams) {
    this.sortStr = this.buildSortStr(params.sort);
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.cargarServicios();
  }

  private buildSortStr(sort: { key: string, value: any }[]): string | null {
    for (let s of sort) {
      if (s.value === 'ascend') return `+${s.key}`;
      if (s.value === 'descend') return `-${s.key}`;
    }
    return null;
  }

  private getHttpQueryParams(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('limit', `${this.pageSize}`);
    params = params.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    if (this.sortStr) {
      params = params.append('sort', this.sortStr);
    }
    if (this.existeFiltroGrupos()) {
      this.getIdsGruposFiltro().forEach((idg: string) => {
        params = params.append('idgrupo[]', idg);
      });
    }
    if (this.textoBusqueda) {
      params = params.append('search', this.textoBusqueda);
    }
    return params;
  }

  filtroGrupoChange() {
    console.log('el grupo cambio');
    console.log(this.filtrosGrupoChk);
    this.calcularCantFiltros();
    this.cargarServicios();
  }

  limpiarFiltroGrupos() {
    this.filtrosGrupoChk = this.filtrosGrupoChk.map((check: ICheckboxData) => {
      check.checked = false;
      return check;
    });
    this.calcularCantFiltros();
    this.cargarServicios();
  }

  getIdsGruposFiltro(): string[] {
    const idg: string[] = [];
    for (let chk of this.filtrosGrupoChk) {
      if (chk.checked) {
        idg.push(chk.value);
      }
    }
    return idg;
  }

  calcularCantFiltros() {
    let cant: number = 0;
    for (let chkgrupo of this.filtrosGrupoChk) {
      if (chkgrupo.checked) {
        cant++;
      }
    }
    this.cantFiltrosAplicados = cant;
  }

  existeFiltroGrupos(): boolean {
    let existe: boolean = false;
    for (let chk of this.filtrosGrupoChk) {
      if (chk.checked) {
        existe = true;
        break;
      }
    }
    return existe;
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
