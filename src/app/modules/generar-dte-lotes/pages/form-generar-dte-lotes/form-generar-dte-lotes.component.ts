import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EstadoFacturaElectronicaDTO } from '@dto/facturacion/estado-factura-electronica.dto';
import { EstadoFacturaElectronicaService } from '@services/facturacion/estado-factura-electronica.service';
import { GenerarDteLotesService } from '@services/facturacion/generar-dte-lotes.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

interface ParametrosGeneracionDTO {
  desde: string,
  hasta: string,
  pagado?: boolean,
  anulado: boolean,
  idestadodte: number
}

@Component({
  selector: 'app-form-generar-dte-lotes',
  templateUrl: './form-generar-dte-lotes.component.html',
  styleUrls: ['./form-generar-dte-lotes.component.scss']
})
export class FormGenerarDteLotesComponent implements OnInit {

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTIONS_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

  lstEstadosDte: EstadoFacturaElectronicaDTO[] = [];
  isLoadingEstadosDte: boolean = false;
  isGenerando: boolean = false;

  form = new FormGroup({
    desde: new FormControl<Date | null>(null, [Validators.required]),
    hasta: new FormControl<Date | null>(null, [Validators.required]),
    pagado: new FormControl<boolean | null>(null),
    anulado: new FormControl<boolean | null>(null, [Validators.required]),
    idestadodte: new FormControl<number | null>(null, [Validators.required])
  })

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private estadosDteSrv: EstadoFacturaElectronicaService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private generarDteLotesSrv: GenerarDteLotesService
  ){}

  ngOnInit(): void {
    this.cargarEstadosDte();
  }

  cargarEstadosDte(){
    this.isLoadingEstadosDte = true;
    let params = new HttpParams();
    this.estadosDteSrv.get(params)
    .pipe(finalize(() => this.isLoadingEstadosDte = false))
    .subscribe({
      next: estadosDte => {
        this.lstEstadosDte = estadosDte;
      },
      error: e => {
        console.error('Error al cargar estados de facturas electronicas', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  getDto(): ParametrosGeneracionDTO {
    return {
      desde: this.dateToString(this.form.controls.desde.value),
      hasta: this.dateToString(this.form.controls.hasta.value),
      pagado: this.form.controls.pagado.value ?? undefined,
      anulado: this.form.controls.anulado.value ?? false,
      idestadodte: this.form.controls.idestadodte.value ?? -1
    }
  }

  generar(){
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.updateValueAndValidity();
    })
    if(!this.form.valid) return;

    this.isGenerando = true;
    this.generarDteLotesSrv.post(this.getDto())
    .pipe(finalize(() => this.isGenerando = false))
    .subscribe({
      next: result => {
        this.notif.success('Exito', `Se generaron ${result} DTEs`);
      },
      error: e => {
        console.error('Error al generar DTEs', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  dateToString(date: Date | null | undefined): string{
    if(date == null) throw new Error('Error al convertir fecha a string');
    return formatDate(date, 'yyyy-MM-dd', this.locale)
  }

}
