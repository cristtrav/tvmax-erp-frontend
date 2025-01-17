import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TalonariosService } from '@services/facturacion/talonarios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { FormatosFacturasService } from '@services/formatos-facturas.service';
import { HttpParams } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { Talonario } from '@dto/talonario.dto';
import { EstablecimientosService } from '@services/facturacion/establecimientos.service';
import { EstablecimientoDTO } from '@dto/facturacion/establecimiento.dto';

@Component({
  selector: 'app-detalle-talonario',
  templateUrl: './detalle-talonario.component.html',
  styleUrls: ['./detalle-talonario.component.scss']
})
export class DetalleTalonarioComponent implements OnInit {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 } as const;

  formatterNroPrefijo = (value: number): string => `${value ? value.toString().padStart(3, '0') : ''}`;
  parserNroPrefijo = (value: string): string => `${value ? Number(value) : ''}`;

  formatterNroFactura = (value: number): string => `${value ? value.toString().padStart(7, '0') : ''}`;
  parserNroFactura = (value: string): string => `${value ? Number(value) : ''}`;

  idtalonario: string = 'nuevo';
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  lastidLoading: boolean = false;
  cargandoEstablecimientos: boolean = false;

  lstFormatos: FormatoFacturaDTO[] = [];
  lstEstablecimientos: EstablecimientoDTO[] = [];

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    codEstablecimiento: new FormControl(null, [Validators.required, Validators.max(999), Validators.min(1)]),
    codPuntoEmision: new FormControl(null, [Validators.required, Validators.max(999), Validators.min(1)]),
    timbrado: new FormControl(null, [Validators.required, Validators.max(99999999), Validators.min(1)]),
    nroInicial: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(9999999)]),
    nroFinal: new FormControl(null, [Validators.min(1), Validators.max(9999999)]),
    ultNroUsado: new FormControl(null, [Validators.max(9999999)]),
    vencimiento: new FormControl(null, null),
    iniciovigencia: new FormControl(null, [Validators.required]),
    activo: new FormControl(true, [Validators.required]),
    electronico: new FormControl(false, [Validators.required]),
    idformato: new FormControl()
  });

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private talonariosSrv: TalonariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private formatosFacturasSrv: FormatosFacturasService,
    private establecimientosSrv: EstablecimientosService
  ) { }

  ngOnInit(): void {
    this.cargarEstablecimientos();
    const idtim = this.aroute.snapshot.paramMap.get('idtalonario');
    this.idtalonario = Number.isInteger(Number(idtim)) ? `${idtim}` : 'nuevo';
    if(this.idtalonario != 'nuevo') this.cargarDatos();
    
    this.form.get('nroInicial')?.valueChanges.subscribe((nroInicio: number | null) => {
      this.form.get('nroFinal')?.clearValidators();
      this.form.get('ultNroUsado')?.clearValidators();
      const nroFin: number | null = this.form.get('nroFinal')?.value;
      this.form.get('nroFinal')?.setValidators([Validators.min(nroInicio ?? 1), Validators.max(9999999)]);
      if (nroInicio) {
        this.form.get('ultNroUsado')?.setValidators([Validators.min(nroInicio), Validators.max(nroFin ?? 9999999)]);
      } else {
        this.form.get('ultNroUsado')?.setValidators([Validators.max(nroFin ?? 9999999)]);
      }

    });
    this.form.get('nroFinal')?.valueChanges.subscribe((nroFin: number | null) => {
      this.form.get('ultNroUsado')?.clearValidators();
      const nroInicio: number | null = this.form.get('nroInicial')?.value;
      if (nroInicio) {
        this.form.get('ultNroUsado')?.setValidators([Validators.min(nroInicio), Validators.max(nroFin ?? 9999999)]);
      } else {
        this.form.get('ultNroUsado')?.setValidators([Validators.max(nroFin ?? 9999999)]);
      }
    });
    this.form.controls.electronico.valueChanges.subscribe(value => {
      if(!value) return;

      this.form.controls.idformato.reset();
      this.form.controls.vencimiento.reset();
      this.form.controls.nroFinal.setValue(9999999);
    })
    this.cargarFormatos();
  }

  cargarFormatos(){
    const params = new HttpParams().append('eliminado', 'false');
    this.formatosFacturasSrv.get(params).subscribe({
      next: (formatos) =>{
        this.lstFormatos = formatos;
      },
      error: (e) => {
        console.error('Error al cargar formatos de de factura', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private cargarEstablecimientos(){
    this.cargandoEstablecimientos = true;
    this.establecimientosSrv.get(new HttpParams())
    .pipe(finalize(() => this.cargandoEstablecimientos = false))
    .subscribe(establecimientos => this.lstEstablecimientos = establecimientos);
  }

  cargarDatos() {
    this.formLoading = true;
    this.talonariosSrv.getPorId(Number(this.idtalonario))
    .pipe(finalize(() => this.formLoading = false))
    .subscribe({
      next: (talonario) => {
        this.form.controls.id.setValue(talonario.id);
        this.form.controls.codEstablecimiento.setValue(talonario.codestablecimiento);
        this.form.controls.codPuntoEmision.setValue(talonario.codpuntoemision);
        this.form.controls.timbrado.setValue(talonario.nrotimbrado);
        this.form.controls.nroInicial.setValue(talonario.nroinicio);
        this.form.controls.nroFinal.setValue(talonario.nrofin);
        this.form.controls.ultNroUsado.setValue(talonario.ultimonrousado);
        this.form.controls.iniciovigencia.setValue(new Date(`${talonario.fechainicio}T00:00:00`));
        if(talonario.fechavencimiento)
          this.form.controls.vencimiento.setValue(new Date(`${talonario.fechavencimiento}T00:00:00`));
        this.form.controls.activo.setValue(talonario.activo);
        this.form.controls.idformato.setValue(talonario.idformatofactura);
        this.form.controls.electronico.setValue(talonario.electronico);
      },
      error: (e) => {
        console.error('Error al consultar talonario por id', e);
        this.httpErrorHandler.process(e);
        this.formLoading = false;
      }
    });
  }

  guardar() {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    })
    if(this.form.valid){
      if(this.idtalonario === 'nuevo') this.registrar();
      else this.editar();
    }
  }

  private editar() {
    this.guardarLoading = true;
    this.talonariosSrv
      .put(Number(this.idtalonario), this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Talonario guardado correctamente');
        },
        error: (e) => {
          console.log('Error al editar talonario', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private registrar() {
    this.guardarLoading = true;
    this.talonariosSrv
      .post(this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Talonario guardado correctamente');
          this.form.reset();
        }, 
        error: (e) => {
          console.error('Error al registrar talonario', e);
          this.httpErrorHandler.process(e);
        }
    });
  }

  getDto(): Talonario {
    const t: Talonario = new Talonario();
    t.id = this.form.controls.id.value;
    t.codestablecimiento = this.form.controls.codEstablecimiento.value;
    t.codpuntoemision = this.form.controls.codPuntoEmision.value;
    t.nrotimbrado = this.form.controls.timbrado.value;
    t.nroinicio = this.form.controls.nroInicial.value;
    t.nrofin = this.form.controls.nroFinal.value;
    t.ultimonrousado = this.form.controls.ultNroUsado.value;
    if(this.form.controls.vencimiento.value)
      t.fechavencimiento = formatDate(this.form.controls.vencimiento.value, 'yyyy-MM-dd', this.locale);
    t.fechainicio = formatDate(this.form.controls.iniciovigencia.value, 'yyyy-MM-dd', this.locale);
    t.activo = this.form.get('activo')?.value;
    t.idformatofactura = this.form.get('idformato')?.value;
    t.electronico = this.form.get('electronico')?.value;
    return t;
  }

  focusOutNroInicial() {
    console.log(this.form.get('nroInicial')?.value);
  }

  generarId(){
    this.lastidLoading = true;
    this.talonariosSrv
      .getUltimoId()
      .pipe(finalize(() => this.lastidLoading = false))
      .subscribe({
        next: (lastid) => {
          this.form.controls.id.setValue(lastid + 1);
        },
        error: (e) => {
          console.error('Error al consultar ultimo ID de talonario', e);
          this.httpErrorHandler.process(e);
        }
    });
  }

}
