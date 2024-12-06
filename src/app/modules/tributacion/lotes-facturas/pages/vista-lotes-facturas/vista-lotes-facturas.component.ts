import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoteFacturaDTO } from '@dto/facturacion/lote-factura.dto';
import { LotesFacturasService } from '@services/facturacion/lotes-facturas.service';
import { SifenService } from '@services/facturacion/sifen.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { Extra } from '@util/extra';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin, pipe } from 'rxjs';

@Component({
  selector: 'app-vista-lotes-facturas',
  templateUrl: './vista-lotes-facturas.component.html',
  styleUrls: ['./vista-lotes-facturas.component.scss']
})
export class VistaLotesFacturasComponent implements OnInit {

  lstLotes: LoteFacturaDTO[] = [];
  loadingLotes: boolean = false;
  generando: boolean = false;

  mapLoadingConsulta: Map<number, boolean> = new Map();
  mapLoadingEnvio: Map<number, boolean> = new Map();

  pageSize: number = 10;
  pageIndex: number = 1;
  total: number = 0;
  sortStr: string | null = '-id';

  constructor(
    private lotesFacturasSrv: LotesFacturasService,
    private notif: NzNotificationService,
    private modal: NzModalService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(){
    this.loadingLotes = true;
    forkJoin({
      lotes: this.lotesFacturasSrv.get(this.getParams()),
      total: this.lotesFacturasSrv.getTotal(this.getParams())
    })
    .pipe(finalize(() => this.loadingLotes = false))
    .subscribe(resp => {
      this.lstLotes = resp.lotes;
      this.total = resp.total;
    });
  }

  private getParams(): HttpParams{
    let params = new HttpParams();
    params = params.append('sort', '-id');
    return params;
  }

  enviarLote(id: number){
    this.mapLoadingEnvio.set(id, true);
    this.lotesFacturasSrv.enviarLote(id)
    .pipe(finalize(() => this.mapLoadingEnvio.set(id, false)))
    .subscribe(() => {
      this.cargarDatos();
      this.notif.success('<strong>Éxito</strong>', 'Lote enviado');
    });
  }

  consultarLote(id: number){
    this.mapLoadingConsulta.set(id, true);
    this.lotesFacturasSrv.consultarLote(id)
    .pipe(finalize(() => this.mapLoadingConsulta.set(id, false)))
    .subscribe(() => {
      this.cargarDatos();
      this.notif.success('<strong>Éxito</strong>', 'Lote actualizado');
    });
  }

  generarLotes(){
    this.generando = false;
    this.lotesFacturasSrv.generarLotes()
    .pipe(finalize(() => this.generando = false))
    .subscribe((res: {cantidad: number, resultado: string}) => {
      this.cargarDatos();
      if(res.cantidad == 0) this.notif.warning('No se generaron lotes', '');
      else this.notif.success('<strong>Éxito</strong>', `Lotes generados: ${res.cantidad}`);
    })
  }

  onTableQueryChange(tableParams: NzTableQueryParams){
    this.pageSize = tableParams.pageSize;
    this.pageIndex = tableParams.pageIndex;
    this.sortStr = Extra.buildSortString(tableParams.sort);
    this.cargarDatos();
  }

  confirmarGenerarLotes(){
    this.modal.confirm({
      nzTitle: '¿Desea generar lotes?',
      nzContent: 'Se generarán lotes para las facturas electrónicas pendientes de envío a SIFEN. Máx. 50 c/u',
      nzOkText: 'Generar',
      nzOnOk: () => this.generarLotes()
    });
  }

  confirmarEnvio(lote: LoteFacturaDTO){
    this.modal.confirm({
      nzTitle: '¿Desea enviar el lote?',
      nzContent: `Se enviará a SIFEN el lote con ${lote.cantidadfacturas} ${lote.cantidadfacturas == 1 ? 'factura':'facturas'}`,
      nzOkText: 'Enviar',
      nzOnOk: () => this.enviarLote(lote.id)
    });
  }

}
