import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timbrado } from '@dto/timbrado.dto';
import { Extra } from '@util/extra';
import { TimbradosService } from '@servicios/timbrados.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-detalle-timbrado',
  templateUrl: './detalle-timbrado.component.html',
  styleUrls: ['./detalle-timbrado.component.scss']
})
export class DetalleTimbradoComponent implements OnInit {

  formatterNroPrefijo = (value: number): string => `${value ? value.toString().padStart(3, '0') : ''}`;
  parserNroPrefijo = (value: string): string => `${value ? Number(value) : ''}`;

  formatterNroFactura = (value: number): string => `${value ? value.toString().padStart(7, '0') : ''}`;
  parserNroFactura = (value: string): string => `${value ? Number(value) : ''}`;

  idtimbrado: string = 'nuevo';
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  lastidLoading: boolean = false;

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
    activo: new FormControl(true, [Validators.required])
  });

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private timbradosSrv: TimbradosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute    
  ) { }

  ngOnInit(): void {
    const idtim = this.aroute.snapshot.paramMap.get('idtimbrado');
    if (idtim) {
      this.idtimbrado = idtim;
      if (idtim !== 'nuevo') {
        this.cargarDatos();
      }
    }
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
  }

  cargarDatos() {
    this.formLoading = true;
    this.timbradosSrv.getPorId(Number(this.idtimbrado)).subscribe({
      next: (timbrado) => {
        this.form.controls.id.setValue(timbrado.id);
        this.form.controls.codEstablecimiento.setValue(timbrado.codestablecimiento);
        this.form.controls.codPuntoEmision.setValue(timbrado.codpuntoemision);
        this.form.controls.timbrado.setValue(timbrado.nrotimbrado);
        this.form.controls.nroInicial.setValue(timbrado.nroinicio);
        this.form.controls.nroFinal.setValue(timbrado.nrofin);
        this.form.controls.ultNroUsado.setValue(timbrado.ultimonrousado);
        this.form.controls.iniciovigencia.setValue(new Date(`${timbrado.fechainicio}T00:00:00`));
        if(timbrado.fechavencimiento)
          this.form.controls.vencimiento.setValue(new Date(`${timbrado.fechavencimiento}T00:00:00`));
        this.form.controls.activo.setValue(timbrado.activo);
        this.formLoading = false;
      },
      error: (e) => {
        console.error('Error al consultar timbrado por id', e);
        this.httpErrorHandler.process(e);
        this.formLoading = false;
      }
    })
    /*this.timbradosSrv.getPorId(Number(this.idtimbrado)).subscribe((data: Timbrado) => {
      this.form.get('id')?.setValue(data.id);
      this.form.get('codEstablecimiento')?.setValue(data.codestablecimiento);
      this.form.get('codPuntoEmision')?.setValue(data.codpuntoemision);
      this.form.get('timbrado')?.setValue(data.nrotimbrado);
      this.form.get('nroInicial')?.setValue(data.nroinicio);
      this.form.get('nroFinal')?.setValue(data.nrofin);
      this.form.get('ultNroUsado')?.setValue(data.ultimonrousado);
      if (data.fechavencimiento) this.form.get('vencimiento')?.setValue(Extra.dateStrToDate(data.fechavencimiento));
      if(data.fechainicio) this.form.get('iniciovigencia')?.setValue(Extra.dateStrToDate(data.fechainicio));
      this.form.get('activo')?.setValue(data.activo);
      this.formLoading = false;
    }, (e) => {
      console.log('Error al cargar datos por id');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.formLoading = false;
    });*/
  }

  guardar() {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    })
    if(this.form.valid){
      if(this.idtimbrado === 'nuevo') this.registrar();
      else this.editar();
    }
  }

  private editar() {
    this.guardarLoading = true;
    this.timbradosSrv.put(Number(this.idtimbrado), this.getDto()).subscribe(() => {
      this.notif.create('success', '<strong>Éxito</strong>', 'Timbrado guardado correctamente');
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al editar timbrado');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private registrar() {
    this.guardarLoading = true;
    this.timbradosSrv.post(this.getDto()).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Timbrado guardado correctamente');
        this.form.reset();
        this.guardarLoading = false;
      }, 
      error: (e) => {
        console.error('Error al registrar timbrado', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  getDto(): Timbrado {
    const t: Timbrado = new Timbrado();
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
    return t;
  }

  focusOutNroInicial() {
    console.log(this.form.get('nroInicial')?.value);
  }

  generarId(){
    this.lastidLoading = true;
    this.timbradosSrv.getUltimoId().subscribe({
      next: (lastid) => {
        this.form.controls.id.setValue(lastid + 1);
        this.lastidLoading = false;
      },
      error: (e) => {
        console.error('Error al consultar ultimo ID de timbrado', e);
        this.httpErrorHandler.process(e);
        this.lastidLoading = false;
      }
    })
  }

}
