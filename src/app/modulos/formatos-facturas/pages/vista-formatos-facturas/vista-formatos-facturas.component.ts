import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { FormatosFacturasService } from '@global-services/formatos-facturas.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-vista-formatos-facturas',
  templateUrl: './vista-formatos-facturas.component.html',
  styleUrls: ['./vista-formatos-facturas.component.scss']
})
export class VistaFormatosFacturasComponent implements OnInit {

  lstFormatos: FormatoFacturaDTO[] = [];
  dataLoading: boolean = false;

  constructor(
    private formatosFacturasSrv: FormatosFacturasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(){
    this.dataLoading = true;
    this.formatosFacturasSrv.get(this.getHttpParams()).subscribe({
      next: (formatos) => {
        this.lstFormatos = formatos;
        this.dataLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar formatos de facturas', e);
        this.httpErrorHandler.process(e);
        this.dataLoading = false;
      }
    })
  }

  getHttpParams(): HttpParams{
    const params = new HttpParams().append('eliminado', 'false');
    return params;
  }

  confirmarEliminacion(formato: FormatoFacturaDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el Formato?',
      nzContent: `«${formato.id} - ${formato.descripcion}»`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminar(formato.id ?? -1);
      }
    })
  }

  eliminar(idformato: number){
    this.formatosFacturasSrv.delete(idformato).subscribe({
      next: () => {
        this.notification.create('success', '<strong>Éxito</strong>', 'Formato eliminado');
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al eliminar formato de factura', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

}
