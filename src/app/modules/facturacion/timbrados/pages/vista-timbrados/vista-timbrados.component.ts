import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { TimbradoDTO } from '@dto/facturacion/timbrado.dto';
import { TimbradosService } from '@services/facturacion/timbrados.service';
import { Extra } from '@util/extra';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { defer, finalize, forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-vista-timbrados',
  templateUrl: './vista-timbrados.component.html',
  styleUrls: ['./vista-timbrados.component.scss']
})
export class VistaTimbradosComponent {

  lstTimbrados: TimbradoDTO[] = [];
  loadingTimbrados: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;
  sortStr: string | null = null;

  mapEliminando = new Map<number, boolean>();

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private timbradosSrv: TimbradosService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  private cargarTimbradosObs(): Observable<{timbrados: TimbradoDTO[], total: number}>{
    return defer(() => {
      this.loadingTimbrados = true;
      return forkJoin({
        timbrados: this.timbradosSrv.get(this.getHttpParams()),
        total: this.timbradosSrv.getTotal(this.getHttpParams())
      }).pipe(finalize(() => this.loadingTimbrados = false));
    });
  }

  cargarTimbrados(){
    this.cargarTimbradosObs().subscribe(resp => {
      this.lstTimbrados = resp.timbrados;
      this.totalRegisters = resp.total;
    });
  }

  private getHttpParams(): HttpParams {
    let params = new HttpParams();
    params = params.append('eliminado', false);
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex - 1) * this.pageSize);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    return params;
  }

  onTableQueryParamsChange(tableQuery: NzTableQueryParams){
    this.pageSize = tableQuery.pageSize;
    this.pageIndex = tableQuery.pageIndex;
    this.sortStr = Extra.buildSortString(tableQuery.sort);
    this.cargarTimbrados();
  }

  confirmarEliminacion(timbrado: TimbradoDTO){
    const fechaInicio = formatDate(timbrado.fechainiciovigencia, 'dd/MM/yyyy', this.locale);
    const fechaVencimiento = timbrado.fechavencimiento ? `${formatDate(timbrado.fechavencimiento, 'dd/MM/yyyy', this.locale)}` : '';
    this.modal.confirm({
      nzTitle: `¿Desea eliminar el timbrado?`,
      nzContent: `${timbrado.nrotimbrado} | F. Inicio: ${fechaInicio}${timbrado.fechavencimiento ? (' | F. Venc.: ' + fechaVencimiento) : ''} | ${timbrado.electronico ? 'Electronico' : 'Preimpreso'}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(timbrado.nrotimbrado)
    })
  }

  eliminar(nrotimbrado: number){
    this.mapEliminando.set(nrotimbrado, true);
    this.timbradosSrv
      .delete(nrotimbrado)
      .pipe(finalize(() => this.mapEliminando.set(nrotimbrado, false)))
      .subscribe(() => {
        this.notif.success('<strong>Éxito</strong>', 'Timbrado eliminado');
        this.cargarTimbrados();
      })
  }
}
