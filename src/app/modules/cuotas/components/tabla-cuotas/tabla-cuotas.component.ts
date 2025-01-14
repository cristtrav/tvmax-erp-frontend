import { HttpParams } from '@angular/common/http';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CuotaDTO } from '@dto/cuota-dto';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CobroCuota } from '@dto/cobro-cuota.dto';
import { finalize, forkJoin, mergeMap } from 'rxjs';
import { CuotasService } from '@services/cuotas.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DecimalPipe, formatDate } from '@angular/common';
import { SuscripcionesService } from '@services/suscripciones.service';
import { ServiciosService } from '@services/servicios.service';


@Component({
  selector: 'app-tabla-cuotas',
  templateUrl: './tabla-cuotas.component.html',
  styleUrls: ['./tabla-cuotas.component.scss']
})
export class TablaCuotasComponent implements OnInit {

  @Input()
  idservicio: number | null = null;
  @Input()
  idsuscripcion: number | null = null;

  lstCuotas: CuotaDTO[] = [];

  mapLoadingCobros = new Map<number, boolean>();
  mapCobros = new Map<number, CobroCuota>();
  mapExonerando = new Map<number, boolean>();

  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 0;
  tableLoading: boolean = false;
  sortStr: string | null = null;

  expandSet = new Set<number>();

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private cuotaSrv: CuotasService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private suscripcionesSrv: SuscripcionesService,
    private serviciosSrv: ServiciosService
  ) { }

  ngOnInit(): void {
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.cargarCobroCuota(id);
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  private cargarCuotas(): void {
    this.tableLoading = true;
    forkJoin({
      cuotas: this.cuotaSrv.get(this.getHttpParams()),
      total: this.cuotaSrv.getTotalRegistros(this.getHttpParams())
    }).subscribe({
      next: (resp) => {
        this.lstCuotas = resp.cuotas;
        this.totalRegisters = resp.total;
        this.tableLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar cuotas', e);
        this.httpErrorHandler.process(e);
        this.tableLoading = false;
      }
    });
  }

  confirmarEliminacion(cuota: CuotaDTO) {
    this.modal.confirm({
      nzTitle: '¿Desea eliminar la cuota?',
      nzContent: `Vencimiento: ${formatDate(cuota.fechavencimiento ?? new Date(), 'dd/MMM/yyyy', this.locale)} | Monto: Gs.${new DecimalPipe(this.locale).transform(cuota.monto)}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(cuota.id ?? -1)
    })
  }

  eliminar(id: number) {
    this.cuotaSrv.delete(id)
      .subscribe({
        next: () => {
          this.notif.create('success', 'Cuota eliminada correctamente', '');
          this.cargarCuotas();
        },
        error: (e) => {
          console.error('Error al eliminar cuota', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  getHttpParams(): HttpParams {
    var par: HttpParams = new HttpParams();
    par = par.append('eliminado', 'false');
    if (this.idsuscripcion) par = par.append('idsuscripcion', this.idsuscripcion);
    if (this.idservicio) par = par.append('idservicio', this.idservicio);
    if (this.sortStr) par = par.append('sort', this.sortStr);

    par = par.append('offset', `${(this.pageIndex - 1) * this.pageSize}`);
    par = par.append('limit', `${this.pageSize}`);
    return par;
  }

  onTableQueryParamsChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarCuotas();
  }

  cargarCobroCuota(idcuota: number) {
    this.mapLoadingCobros.set(idcuota, true);
    this.cuotaSrv.getCobroCuota(idcuota)
      .pipe(finalize(() => this.mapLoadingCobros.set(idcuota, false)))
      .subscribe({
        next: (cobro) => {
          this.mapCobros.set(idcuota, cobro);
        },
        error: (e) => {
          this.mapCobros.delete(idcuota);
          if (e.status !== 404) {
            this.httpErrorHandler.process(e);
            console.log('Error al consultar cobro de cuota');
            console.log(e);
          }
        }
      });
  }

  confirmarExoneracion(cuota: CuotaDTO) {
    this.modal.confirm({
      nzTitle: `¿Desea exonerar la cuota?`,
      nzContent: `Vencimiento: ${formatDate(cuota.fechavencimiento ?? new Date(), 'dd/MMM/yyyy', this.locale)} | Monto: Gs.${new DecimalPipe(this.locale).transform(cuota.monto)}`,
      nzOkText: 'Exonerar',
      nzOnOk: () => this.exonerar(cuota)
    })
  }

  exonerar(cuota: CuotaDTO) {
    const cuotaExo = {
      ...cuota,
      monto: 0,
      pagado: true,
      fechavencimiento: formatDate(cuota.fechavencimiento ?? new Date(), 'yyyy-MM-dd', this.locale)
    };
    this.mapExonerando.set(cuota.id ?? -1, true);
    this.cuotaSrv.put(cuota.id ?? -1, cuotaExo)
      .pipe(finalize(() => this.mapExonerando.set(cuota.id ?? -1, false)))
      .subscribe({
        next: () => {
          this.cargarCuotas();
        },
        error: (e) => {
          console.log('Error al exonerar cuota', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  confirmarReversionExoneracion(cuota: CuotaDTO) {
    this.modal.confirm({
      nzTitle: `¿Desea revertir la exoneración de la cuota?`,
      nzContent: `Vencimiento: ${formatDate(cuota.fechavencimiento ?? new Date(), 'dd/MMM/yyyy', this.locale)} | Monto: Gs.${new DecimalPipe(this.locale).transform(cuota.monto)}`,
      nzOkText: 'Revertir',
      nzOnOk: () => this.revertirExoneracion(cuota)
    })
  }

  revertirExoneracion(cuota: CuotaDTO) {
    if (!this.idsuscripcion) {
      this.notif.error('<strong>Error al revertir exoneración</strong>', 'No se puede cargar la suscripción');
      return;
    }
    const cuotaExo = {
      ...cuota,
      monto: 0,
      pagado: false,
      fechavencimiento: formatDate(cuota.fechavencimiento ?? new Date(), 'yyyy-MM-dd', this.locale)
    };
    this.mapExonerando.set(cuota.id ?? -1, true);
    forkJoin({
      suscripcion: this.suscripcionesSrv.getPorId(this.idsuscripcion),
      servicio: this.serviciosSrv.getServicioPorId(cuota.idservicio ?? -1)
    })
    .pipe(
      mergeMap(resp => {
          if(cuota.idservicio == resp.suscripcion.idservicio)
            cuotaExo.monto = resp.suscripcion.monto ?? 0;
          else cuotaExo.monto = resp.servicio.precio ?? 0;
          return this.cuotaSrv.put(cuota.id ?? -1, cuotaExo)
        }),
        finalize(() => this.mapExonerando.set(cuota.id ?? -1, false))
      )
      .subscribe({
        next: () => {
          this.cargarCuotas();
        },
        error: (e) => {
          console.log('Error al revertir exoneraración de cuotas', e);
          this.httpErrorHandler.process(e);
        }
      })
    /*this.cuotaSrv.put(cuota.id ?? -1, cuotaExo)
    .pipe(finalize(() => this.mapExonerando.set(cuota.id ?? -1, false)))
    .subscribe({
      next: () => {
        this.cargarCuotas();
      },
      error: (e) => {
        console.log('Error al exonerar cuota', e);
        this.httpErrorHandler.process(e);
      }
    })*/
  }

}