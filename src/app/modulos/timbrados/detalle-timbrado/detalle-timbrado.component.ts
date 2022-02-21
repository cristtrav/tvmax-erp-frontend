import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timbrado } from '@dto/timbrado.dto';
import { Extra } from '@util/extra';
import { TimbradosService } from '@servicios/timbrados.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';

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
  formGroup: FormGroup = this.formBuilder.group({
    id: [null, [Validators.required]],
    codEstablecimiento: [null, [Validators.required, Validators.max(999), Validators.min(1)]],
    codPuntoEmision: [null, [Validators.required, Validators.max(999), Validators.min(1)]],
    timbrado: [null, [Validators.required, Validators.max(99999999), Validators.min(1)]],
    nroInicial: [null, [Validators.required, Validators.min(1), Validators.max(9999999)]],
    nroFinal: [null, [Validators.required, Validators.min(1), Validators.max(9999999)]],
    ultNroUsado: [null, [Validators.max(9999999)]],
    vencimiento: [null, null],
    iniciovigencia: [null, [Validators.required]],
    activo: [true, [Validators.required]]
  });


  constructor(
    private formBuilder: FormBuilder,
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
    this.formGroup.get('nroInicial')?.valueChanges.subscribe((nroInicio: number | null) => {
      this.formGroup.get('nroFinal')?.clearValidators();
      this.formGroup.get('ultNroUsado')?.clearValidators();
      const nroFin: number | null = this.formGroup.get('nroFinal')?.value;
      this.formGroup.get('nroFinal')?.setValidators([Validators.required, Validators.min(nroInicio ?? 1), Validators.max(9999999)]);
      if (nroInicio) {
        this.formGroup.get('ultNroUsado')?.setValidators([Validators.min(nroInicio), Validators.max(nroFin ?? 9999999)]);
      } else {
        this.formGroup.get('ultNroUsado')?.setValidators([Validators.max(nroFin ?? 9999999)]);
      }

    });
    this.formGroup.get('nroFinal')?.valueChanges.subscribe((nroFin: number | null) => {
      this.formGroup.get('ultNroUsado')?.clearValidators();
      const nroInicio: number | null = this.formGroup.get('nroInicial')?.value;
      if (nroInicio) {
        this.formGroup.get('ultNroUsado')?.setValidators([Validators.min(nroInicio), Validators.max(nroFin ?? 9999999)]);
      } else {
        this.formGroup.get('ultNroUsado')?.setValidators([Validators.max(nroFin ?? 9999999)]);
      }
    });
  }

  cargarDatos() {
    this.formLoading = true;
    this.timbradosSrv.getPorId(Number(this.idtimbrado)).subscribe((data: Timbrado) => {
      this.formGroup.get('id')?.setValue(data.id);
      this.formGroup.get('codEstablecimiento')?.setValue(data.codestablecimiento);
      this.formGroup.get('codPuntoEmision')?.setValue(data.codpuntoemision);
      this.formGroup.get('timbrado')?.setValue(data.nrotimbrado);
      this.formGroup.get('nroInicial')?.setValue(data.nroinicio);
      this.formGroup.get('nroFinal')?.setValue(data.nrofin);
      this.formGroup.get('ultNroUsado')?.setValue(data.ultnrousado);
      if (data.fechavencimiento) this.formGroup.get('vencimiento')?.setValue(Extra.dateStrToDate(data.fechavencimiento));
      if(data.fechainicio) this.formGroup.get('iniciovigencia')?.setValue(Extra.dateStrToDate(data.fechainicio));
      this.formGroup.get('activo')?.setValue(data.activo);
      this.formLoading = false;
    }, (e) => {
      console.log('Error al cargar datos por id');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.formLoading = false;
    });
  }

  private validado(): boolean {
    let val = true;
    Object.keys(this.formGroup.controls).forEach((key) => {
      const ctrl = this.formGroup.get(key);
      if (ctrl !== null) {
        ctrl.markAsDirty();
        ctrl.updateValueAndValidity();
        if (!ctrl.disabled) {
          val = val && ctrl.valid;
        }
      }
    });
    return val;
  }

  guardar() {
    if (this.validado()) {
      if (this.idtimbrado === 'nuevo') {
        this.registrar();
      } else {
        this.editar();
      }
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
    this.timbradosSrv.post(this.getDto()).subscribe(() => {
      this.notif.create('success', '<strong>Éxito</strong>', 'Timbrado guardado correctamente');
      this.guardarLoading = false;
      this.formGroup.reset();
    }, (e) => {
      console.log('Error al registrar timbrado');
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  getDto(): Timbrado {
    const t: Timbrado = new Timbrado();
    t.id = this.formGroup.get('id')?.value;
    t.codestablecimiento = this.formGroup.get('codEstablecimiento')?.value;
    t.codpuntoemision = this.formGroup.get('codPuntoEmision')?.value;
    t.nrotimbrado = this.formGroup.get('timbrado')?.value;
    t.nroinicio = this.formGroup.get('nroInicial')?.value;
    t.nrofin = this.formGroup.get('nroFinal')?.value;
    const ultNro: string | null = this.formGroup.get('ultNroUsado')?.value;
    if(ultNro) t.ultnrousado = this.formGroup.get('ultNroUsado')?.value;
    const fvDate: Date = this.formGroup.get('vencimiento')?.value;
    t.fechavencimiento = Extra.dateToString(fvDate);
    if(this.formGroup.get('iniciovigencia')) t.fechainicio = Extra.dateToString(this.formGroup.get('iniciovigencia')?.value);
    t.activo = this.formGroup.get('activo')?.value;
    return t;
  }

  focusOutNroInicial() {
    console.log(this.formGroup.get('nroInicial')?.value);
  }

}
