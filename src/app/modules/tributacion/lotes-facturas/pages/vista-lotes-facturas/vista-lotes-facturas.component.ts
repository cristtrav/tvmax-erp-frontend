import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoteDetalleDTO } from '@dto/facturacion/lote-detalle.dto';
import { LoteFacturaDTO } from '@dto/facturacion/lote-factura.dto';
import { LotesFacturasService } from '@services/facturacion/lotes-facturas.service';
import { Extra } from '@util/extra';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

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

  expandSet = new Set<number>();
  loadingDetallesMap = new Map<number, boolean>();
  detallesMap = new Map<number, LoteDetalleDTO[]>();

  constructor(
    private lotesFacturasSrv: LotesFacturasService,
    private notif: NzNotificationService,
    private modal: NzModalService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDetallesLote(idlote: number){
    this.loadingDetallesMap.set(idlote, true);
    this.lotesFacturasSrv.getDetallesPorIdLote(idlote)
    .pipe(finalize(() => this.loadingDetallesMap.set(idlote, false)))
    .subscribe(detalles => this.detallesMap.set(idlote, detalles));
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked){
      this.expandSet.add(id);
      this.cargarDetallesLote(id);
    } else{
      this.expandSet.delete(id);
      this.loadingDetallesMap.delete(id);
      this.detallesMap.delete(id);
    }
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
      this.expandSet.forEach(idlote => this.cargarDetallesLote(idlote));
    });
  }

  private getParams(): HttpParams{
    let params = new HttpParams();
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex - 1) * this.pageSize);
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
      nzContent: 'Se generarán lotes para los documentos electrónicos pendientes de envío a SIFEN. Máx. 50 c/u',
      nzOkText: 'Generar',
      nzOnOk: () => this.generarLotes()
    });
  }

  confirmarEnvio(lote: LoteFacturaDTO){
    this.modal.confirm({
      nzTitle: '¿Desea enviar el lote?',
      nzContent: `Se enviará a SIFEN el lote con ${lote.cantidadfacturas} ${lote.cantidadfacturas == 1 ? 'documento':'documentos'}`,
      nzOkText: 'Enviar',
      nzOnOk: () => this.enviarLote(lote.id)
    });
  }

}
