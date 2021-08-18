import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { Servicio } from './../../../dto/servicio-dto';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

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

  constructor(
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private httpErrorRespSrv: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  private cargarServicios(): void {
    this.tableLoading = true;
    const params: IFilter[] = [];
    if (this.sortStr) {
      params.push({ key: 'sort', value: this.sortStr });
    }
    params.push({ key: 'eliminado', value: false });
    params.push({ key: 'limit', value: this.pageSize });
    params.push({ key: 'offset', value: (this.pageIndex-1)*this.pageSize });
    this.serviciosSrv.getServicios(params).subscribe((data) => {
      this.lstServicios = data;
      this.tableLoading = false;
    }, (e) => {
      console.log('Error al cargar Servicios');
      console.log(e);
      this.notif.create('error', 'Error al cargar servicios', e.error);
      this.tableLoading = false;
    });

    const paramsTotal: IFilter[] = [];
    paramsTotal.push({ key: 'eliminado', value: false });
    this.serviciosSrv.getTotalRegistros(paramsTotal).subscribe((data) => {
      this.totalRegisters = data;
    }, (e) => {
      console.log('Error al cargar totales de registros de servicios');
      console.log(e);
      this.httpErrorRespSrv.handle(e);
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

  private buildSortStr(sort: IFilter[]): string | null {
    for (let s of sort) {
      if (s.value === 'ascend') return `+${s.key}`;
      if (s.value === 'descend') return `-${s.key}`;
    }
    return null;
  }

}

interface IFilter {
  key: string;
  value: any | null;
}
