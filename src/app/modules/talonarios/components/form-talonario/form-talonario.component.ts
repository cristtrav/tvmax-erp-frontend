import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablecimientoDTO } from '@dto/facturacion/establecimiento.dto';
import { Talonario } from '@dto/facturacion/talonario.dto';
import { TimbradoDTO } from '@dto/facturacion/timbrado.dto';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { EstablecimientosService } from '@services/facturacion/establecimientos.service';
import { TalonariosService } from '@services/facturacion/talonarios.service';
import { TimbradosService } from '@services/facturacion/timbrados.service';
import { FormatosFacturasService } from '@services/formatos-facturas.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, forkJoin, mergeMap, of, defer, finalize, catchError } from 'rxjs';

@Component({
  selector: 'app-form-talonario',
  templateUrl: './form-talonario.component.html',
  styleUrls: ['./form-talonario.component.scss']
})
export class FormTalonarioComponent {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 } as const;

  formatterNroPrefijo = (value: number): string => `${value ? value.toString().padStart(3, '0') : ''}`;
  parserNroPrefijo = (value: string): string => `${value ? Number(value) : ''}`;

  formatterNroFactura = (value: number): string => `${value ? value.toString().padStart(7, '0') : ''}`;
  parserNroFactura = (value: string): string => `${value ? Number(value) : ''}`;

  @Input()
  nrotimbrado?: number;

  @Output()
  onEditTalonario: EventEmitter<Talonario> = new EventEmitter();

  idtalonario: string = 'nuevo';
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  lastidLoading: boolean = false;
  cargandoEstablecimientos: boolean = false;

  lstFormatos: FormatoFacturaDTO[] = [];
  lstEstablecimientos: EstablecimientoDTO[] = [];
  
  lstTimbrados: TimbradoDTO[] = [];
  loadingTimbrados: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    codEstablecimiento: new FormControl(null, [Validators.required, Validators.max(999), Validators.min(1)]),
    codPuntoEmision: new FormControl(null, [Validators.required, Validators.max(999), Validators.min(1)]),
    nrotimbrado: new FormControl(null, [Validators.required, Validators.max(99999999), Validators.min(1)]),
    nroInicial: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(9999999)]),
    nroFinal: new FormControl(null, [Validators.min(1), Validators.max(9999999)]),
    ultNroUsado: new FormControl(null, [Validators.max(9999999)]),
    activo: new FormControl(true, [Validators.required]),
    idformato: new FormControl(),
    tipodocumento: new FormControl<string | null>(null, [Validators.required])
  });

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private talonariosSrv: TalonariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private router: Router,
    private formatosFacturasSrv: FormatosFacturasService,
    private establecimientosSrv: EstablecimientosService,
    private timbradosSrv: TimbradosService
  ) { }

  ngOnInit(): void {
    this.cargarEstablecimientos();
    const idtim = this.aroute.snapshot.paramMap.get('idtalonario');
    this.idtalonario = Number.isInteger(Number(idtim)) ? `${idtim}` : 'nuevo';
    const observables: {
      timbrados: Observable<TimbradoDTO[]>,
      talonario?: Observable<Talonario>
    } = {
      timbrados: this.cargarTimbradosObs()
    }
    if(this.idtalonario == 'nuevo' && this.nrotimbrado != null)
      this.form.controls.nrotimbrado.setValue(this.nrotimbrado);
    if(this.idtalonario != 'nuevo')
      observables.talonario = this.cargarDatosObs(Number(this.idtalonario))

    forkJoin(observables)
    .pipe(mergeMap(resp => {
      //Verificar si el nro timbrado del talonario esta en la lista y anexar de ser necesario
      const nroTalonVerificacion = resp.talonario?.nrotimbrado ?? this.nrotimbrado;
      if(
        nroTalonVerificacion != null &&
        !resp.timbrados.some(t => t.nrotimbrado == nroTalonVerificacion)
      ) return this.timbradosSrv.getByNroTimbrado(nroTalonVerificacion ?? -1)
        .pipe(mergeMap(timb => of({
            timbrados: resp.timbrados.concat([timb]),
            talonario: resp.talonario
          })
        ));
      else return of(resp);
    }))
    .subscribe(resp => {
      this.cargarTimbradosNext(resp.timbrados);
      if(resp.talonario != null) this.cargarDatosNext(resp.talonario);
    });
    
    this.asignarListeners();
    this.cargarFormatos();
    this.cargarTimbrados();
  }

  private asignarListeners(){
    this.form.controls.nroInicial.valueChanges.subscribe((nroInicio: number | null) => {
      this.form.controls.nroFinal.clearValidators();
      this.form.controls.ultNroUsado.clearValidators();
      const nroFin: number | null = this.form.controls.nroFinal.value;
      this.form.controls.nroFinal.setValidators([Validators.min(nroInicio ?? 1), Validators.max(9999999)]);
      if (nroInicio) {
        this.form.controls.ultNroUsado.setValidators([Validators.min(nroInicio), Validators.max(nroFin ?? 9999999)]);
      } else {
        this.form.controls.ultNroUsado.setValidators([Validators.max(nroFin ?? 9999999)]);
      }
    });

    this.form.controls.nroFinal.valueChanges.subscribe((nroFin: number | null) => {
      this.form.controls.ultNroUsado.clearValidators();
      const nroInicio: number | null = this.form.controls.nroInicial.value;
      if (nroInicio) {
        this.form.controls.ultNroUsado.setValidators([Validators.min(nroInicio), Validators.max(nroFin ?? 9999999)]);
      } else {
        this.form.controls.ultNroUsado.setValidators([Validators.max(nroFin ?? 9999999)]);
      }
    });
    this.form.controls.nrotimbrado.valueChanges.subscribe(value => {
      let electronico = this.lstTimbrados.find(t => t.nrotimbrado == value)?.electronico ?? false;
      if(!electronico) return;

      this.form.controls.idformato.reset();
      this.form.controls.nroFinal.setValue(9999999);
    });
  }

  private cargarTimbradosObs(): Observable<TimbradoDTO[]>{
    const params = new HttpParams()
      .append('sort', '-fechainiciovigencia')
      .append('eliminado', false)
      .append('activo', true);
    return defer(() => {
      this.loadingTimbrados = true;
      return this.timbradosSrv
        .get(params)
        .pipe(finalize(() => this.loadingTimbrados = false));
    });
  }

  cargarTimbrados(){
    this.cargarTimbradosObs().subscribe(timbrados => {
      this.cargarTimbradosNext(timbrados);
    });
  }

  private cargarTimbradosNext(timbrados: TimbradoDTO[]){
    this.lstTimbrados = timbrados;
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
    this.cargarDatosObs(Number(this.idtalonario)).subscribe(talonario => {
        this.cargarDatosNext(talonario);
    });
  }

  private cargarDatosNext(talonario: Talonario){
    this.form.controls.id.setValue(talonario.id);
    this.form.controls.codEstablecimiento.setValue(talonario.codestablecimiento);
    this.form.controls.codPuntoEmision.setValue(talonario.codpuntoemision);
    this.form.controls.nrotimbrado.setValue(talonario.nrotimbrado);
    this.form.controls.nroInicial.setValue(talonario.nroinicio);
    this.form.controls.nroFinal.setValue(talonario.nrofin);
    this.form.controls.ultNroUsado.setValue(talonario.ultimonrousado);
    this.form.controls.activo.setValue(talonario.activo);
    this.form.controls.idformato.setValue(talonario.idformatofactura);
    this.form.controls.tipodocumento.setValue(talonario.tipodocumento);
  }

  private cargarDatosObs(idtalonario: number): Observable<Talonario> {
    return defer(() => {
      this.formLoading = true;
      return this.talonariosSrv
        .getPorId(idtalonario)
        .pipe(
          finalize(() => this.formLoading = false),
          catchError(e => {
            console.log('Error al cargar talonario', e);
            this.notif.error('Error al consultar talonario por id', e);
            throw e;
          })
        );
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
    console.log(this.aroute.snapshot.paramMap.get('nrotimbrado'));
    this.guardarLoading = true;
    this.talonariosSrv
      .put(Number(this.idtalonario), this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Talonario guardado correctamente');
          this.idtalonario = this.form.controls.id.value;
          this.router.navigate([this.form.controls.id.value, { relativeTo: this.aroute.parent }]);
          this.onEditTalonario.emit(this.getDto());
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
    t.nrotimbrado = this.form.controls.nrotimbrado.value;
    t.nroinicio = this.form.controls.nroInicial.value;
    t.nrofin = this.form.controls.nroFinal.value;
    t.ultimonrousado = this.form.controls.ultNroUsado.value;
    t.activo = this.form.controls.activo.value;
    t.idformatofactura = this.form.controls.idformato.value;
    t.tipodocumento = this.form.controls.tipodocumento.value;
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
