import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PremioDTO } from '@dto/premio.dto';
import { PremiosService } from '@servicios/premios.service';
import { SorteosService } from '@servicios/sorteos.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-vista-premios',
  templateUrl: './vista-premios.component.html',
  styleUrls: ['./vista-premios.component.scss']
})
export class VistaPremiosComponent implements OnInit {

  idsorteo: string | null = null;
  sorteo: string = '(sin sorteo)';

  lstPremios: PremioDTO[] = [];
  loadingPremios: boolean = false;
  totalRegisters: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  sortStr: string | null = null;

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private sorteoSrv: SorteosService,
    private premiosSrv: PremiosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const idTmp = Number(this.aroute.snapshot.paramMap.get('idsorteo'));
    if(!Number.isNaN(idTmp)){
      this.idsorteo = `${idTmp}`
      this.cargarSorteo(idTmp);
      this.cargarPremios();
    }else this.router.navigate(['/app', 'sorteos']);
  }

  cargarSorteo(id: number){
    this.sorteoSrv.getPorId(id).subscribe({
      next: (sorteo) => this.sorteo = sorteo.descripcion,
      error: (e) => {
        console.log('Error al cargar sorteo por ID', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  cargarPremios(){
    this.loadingPremios = true;
    forkJoin({
      premios: this.premiosSrv.getPremiosPorSorteo(Number(this.idsorteo), this.getHttpParams()),
      total: this.premiosSrv.getTotalPremiosPorSorteo(Number(this.idsorteo), this.getHttpParams())
    })
    .pipe(finalize(() => this.loadingPremios = false))
    .subscribe({
      next: (resp) => {
        this.lstPremios = resp.premios;
        this.totalRegisters = resp.total;
      },
      error: (e) => {
        console.error('Error al cargar premios por sorteos', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private getHttpParams(): HttpParams {
    let params = new HttpParams().append('eliminado', 'false');
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex - 1) * this.pageSize);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    return params;
  }

  onTableQueryParamsChange(tableQuery: NzTableQueryParams){
    this.pageSize = tableQuery.pageSize;
    this.pageIndex = tableQuery.pageIndex;
    this.sortStr = Extra.buildSortString(tableQuery.sort);
    this.cargarPremios();
  }

  confirmarEliminacion(premio: PremioDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el premio?',
      nzContent: `${premio.id} - ${premio.descripcion} (Premio nro. ${premio.nropremio})`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(premio.id)
    });
  }

  eliminar(id: number){
    this.premiosSrv.delete(id).subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Premio eliminado correctamente.');
        this.cargarPremios();
      },
      error: (e) => {
        console.error('Error al eliminar premio', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

}
