import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServerResponseList } from '../../../../app/dto/server-response-list.dto';
import { Cuota } from './../../../dto/cuota-dto';
import { CuotasService} from './../../../servicios/cuotas.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Extra } from '../../../util/extra';

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

  lstCuotas: Cuota[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRegisters: number = 0;
  tableLoading: boolean = false;
  sortStr: string | null = null;

  constructor(
    private cuotaSrv: CuotasService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarCuotas();
  }

  private cargarCuotas(): void{
    //console.log('Se cargan las cuotas');
    this.tableLoading = true;
    this.cuotaSrv.get(this.getHttpParams()).subscribe((resp: ServerResponseList<Cuota>)=>{
      this.lstCuotas = resp.data;
      this.totalRegisters = resp.queryRowCount;
      this.tableLoading = false;
    }, (e)=>{
      console.log('Error al cargar cuotas');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.tableLoading = false;
    });
  }

  eliminar(id: number | null): void{
    if(id){
      this.cuotaSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Cuota eliminada correctamente', '');
        this.cargarCuotas();
      }, (e)=>{
        console.log('Error al eliminar cuota');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

  getHttpParams(): HttpParams {
    var par: HttpParams = new HttpParams();
    par = par.append('eliminado', 'false');
    if(this.idsuscripcion){
      par = par.append('idsuscripcion', this.idsuscripcion);
    }
    if(this.idservicio){
      par = par.append('idservicio', this.idservicio);
    }
    if(this.sortStr){
      par = par.append('sort', this.sortStr);
    }
    par = par.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    par = par.append('limit', `${this.pageSize}`);
    return par;
  }

  onTableQueryParamsChange(params: NzTableQueryParams){
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.sortStr = Extra.buildSortString(params.sort);
    this.cargarCuotas();
  }


}
