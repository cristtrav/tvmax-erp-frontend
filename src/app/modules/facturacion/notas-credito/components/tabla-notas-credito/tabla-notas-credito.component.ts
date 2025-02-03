import { DecimalPipe, formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { DteDTO } from '@dto/facturacion/factura-electronica.dto';
import { NotaCreditoDetalleDTO } from '@dto/facturacion/nota-credito-detalle.dto';
import { NotaCreditoDTO } from '@dto/facturacion/nota-credito.dto';
import { NotasCreditoService } from '@services/facturacion/notas-credito.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { DTEFileUtilsService } from '@services/sifen-utils/dte-file-utils.service';
import { Extra } from '@util/extra';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, defer, forkJoin, finalize } from 'rxjs';

@Component({
  selector: 'app-tabla-notas-credito',
  templateUrl: './tabla-notas-credito.component.html',
  styleUrls: ['./tabla-notas-credito.component.scss']
})
export class TablaNotasCreditoComponent {

  lstNotasCredito: NotaCreditoDTO[] = [];
  loadingDatos: boolean = false;

  totalRegisters: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  sortStr: string | null = null;

  expandSet = new Set<number>();
  mapDetalles: Map<number, NotaCreditoDetalleDTO[]> = new Map();
  mapLoadingDetalles: Map<number, boolean> = new Map();

  mapLoadingDTE: Map<number, boolean> = new Map();
  mapDte: Map<number, DteDTO> = new Map();
  mapLoadingDteXml: Map<number, boolean> = new Map();
  mapLoadingKude: Map<number, boolean> = new Map();
  mapLoadingConsultaDte = new Map<number, boolean>();

  mapEliminando: Map<number, boolean> = new Map();
  mapAnulando: Map<number, boolean> = new Map();
  
  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private notasCreditoSrv: NotasCreditoService,
    private dteFileUtilsSrv: DTEFileUtilsService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
      this.cargarDetalles(id);
      this.cargarDte(id);
    } else {
      this.expandSet.delete(id);
      this.mapDetalles.delete(id);
    }
  }

  cargarDetalles(idnota: number){
    this.mapLoadingDetalles.set(idnota, true);
    this.notasCreditoSrv
      .getDetallesPorIdNota(idnota)
      .pipe(finalize(() => this.mapLoadingDetalles.set(idnota, false)))
      .subscribe((detalles) => {
        this.mapDetalles.set(idnota, detalles);
      })
  }

  cargarDatos(){
    this.cargarDatosObs().subscribe((resp) => {
      this.lstNotasCredito = resp.notas;
      this.totalRegisters = resp.total;
    });
  }

  cargarDatosObs(): Observable<{notas: NotaCreditoDTO[], total: number}>{
    return defer(() => {
      this.loadingDatos = true;
      return forkJoin({
        notas: this.notasCreditoSrv.NotaCreditoElectronica(this.getHttpParams()),
        total: this.notasCreditoSrv.count(this.getHttpParams())
      })
      .pipe(finalize(() => this.loadingDatos = false))
    })
  }

  getHttpParams(): HttpParams {
    let params = new HttpParams();
    params = params.append('eliminado', false);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex - 1) * this.pageSize);
    return params;
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarDatos();
  }

  descargarDteXml(idnota: number){
    this.mapLoadingDteXml.set(idnota, true);
    this.notasCreditoSrv.getDteXml(idnota)
    .pipe(finalize(() => this.mapLoadingDteXml.set(idnota, false)))
    .subscribe({
      next: (dte) => {
        const nota = this.lstNotasCredito.find(n => n.id == idnota);
        const nombrearchivo = nota != null ? `NOTA-CREDITO-${nota.prefijonota}-${(nota.nronota ?? 0).toString().padStart(7, '0')}` : 'NOTA-CREDITO'
        this.dteFileUtilsSrv.downloadDTE(dte, nombrearchivo);
      },
      error: (e) => {
        console.error("Error al descargar DTE de factura electrónica", e);
        this.notif.error(
          "<strong>Error al descargar DTE</strong>",
          e.status == 404 ? 'No se encontró el archivo' : e.statusText
        );
      }
    })
  }

  descargarKUDE(idventa: number){
    this.mapLoadingKude.set(idventa, true);    
    this.notasCreditoSrv.getKUDE(idventa)
    .pipe(finalize(() => this.mapLoadingKude.set(idventa, false)))
    .subscribe({
      next: (kude) => {
        const nota = this.lstNotasCredito.find(v => v.id == idventa);
        const nombrearchivo = nota != null ? `NOTA-CREDITO-${nota.prefijonota}-${(nota.nronota ?? 0).toString().padStart(7, '0')}` : 'NOTA-CREDITO'
        this.dteFileUtilsSrv.downloadKUDE(kude, nombrearchivo);
      },
      error: (e) => {
        console.error("Error al descargar KuDE de nota de crédito electrónica", e);
        this.notif.error(
          "<strong>Error al descargar KuDE</strong>",
          e.status == 404 ? 'No se encontró el archivo' : e.statusText
        );
      }
    })
  }

  private cargarDte(idnota: number){
    this.mapLoadingDTE.set(idnota, true);
    this.notasCreditoSrv.getDTE(idnota)
    .pipe(finalize(() => this.mapLoadingDTE.set(idnota, false)))
    .subscribe({
      next: dte => {
        this.mapDte.set(idnota, dte);
        this.lstNotasCredito = this.lstNotasCredito.map(nota => {
          if(nota.id == idnota){
            nota.idestadodte = dte.idestadodocumento;
            return nota;
          }
          return nota;
        })
      },
      error: (e) => {
        console.error('Error al cargar factura electronica', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  /*consutlarSifen(id: number){
    this.mapLoadingConsultaDte.set(id, true);
    this.notasCreditoSrv.consultarFacturaSifen(id)
    .pipe(finalize(() => this.loadingConsultaDTEMap.set(id, false)))
    .subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Factura sincronizada');
        this.cargarFacturaElectronica(id);
      },
      error: (e) => {
        console.log('Error al consultar factura en SIFEN', e);
        this.httpErrorHandler.process(e);
      }
    });
  }*/

  confirmarEliminacion(nota: NotaCreditoDTO){
    const nronota = `${nota.prefijonota}-${nota.nronota.toString().padStart(7,'0')}`;
    this.modal.confirm({
      nzTitle: '¿Desea eliminar la nota de crédito?',
      nzContent: `${nronota} | ${formatDate(nota.fechahora, 'dd/MM/yyyy HH:mm', this.locale)} | Gs.${new DecimalPipe(this.locale).transform(nota.total)}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(nota.id)
    });
  }

  eliminar(id: number){
    this.mapEliminando.set(id, true);
    this.notasCreditoSrv
      .delete(id)
      .pipe(finalize(() => this.mapEliminando.set(id, false)))
      .subscribe(() => {
        this.notif.success(`<strong>Éxito</strong>`, 'Nota eliminada correctamente');
        this.cargarDatos();
      })
  }

  confirmarAnulacion(nota: NotaCreditoDTO){
    const nronota = `${nota.prefijonota}-${nota.nronota.toString().padStart(7,'0')}`;
    this.modal.confirm({
      nzTitle: '¿Desea anular la nota de crédito?',
      nzContent: `${nronota} | ${formatDate(nota.fechahora, 'dd/MM/yyyy HH:mm', this.locale)} | Gs.${new DecimalPipe(this.locale).transform(nota.total)}`,
      nzOkDanger: true,
      nzOkText: 'Anular',
      nzOnOk: () => this.anular(nota.id)
    })
  }

  anular(idnota: number){
    this.mapAnulando.set(idnota, true);
    this.notasCreditoSrv
      .cancelar(idnota)
      .pipe(finalize(() => this.mapAnulando.set(idnota, false)))
      .subscribe(() => {
        this.notif.success('<strong>Éxito</strong>', 'Nota de crédito anulada correctamente');
        this.cargarDatos();
      })
  }

}
