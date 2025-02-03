import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TimbradoDTO } from '@dto/facturacion/timbrado.dto';
import { TimbradosService } from '@services/facturacion/timbrados.service';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-timbrado',
  templateUrl: './detalle-timbrado.component.html',
  styleUrls: ['./detalle-timbrado.component.scss']
})
export class DetalleTimbradoComponent implements OnInit {

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

  nrotimbrado: string = 'nuevo';
  guardando: boolean = false;
  cargandoDatos: boolean = false;

  form = new FormGroup({
    nrotimbrado: new FormControl<number | null>(null, [Validators.required]),
    fechaInicio: new FormControl<Date | null>(null, [Validators.required]),
    fechaVencimiento: new FormControl<Date | null>(null),
    electronico: new FormControl<boolean>(true, [Validators.required]),
    activo: new FormControl<boolean>(true, [Validators.required])
  })

  constructor(
    private aroute: ActivatedRoute,
    private timbradosSrv: TimbradosService,
    private notif: NzNotificationService,
    private router: Router
  ){}

  ngOnInit(): void {
    const nrotimbradoStr = this.aroute.snapshot.paramMap.get('nrotimbrado');
    if(Number.isInteger(Number(nrotimbradoStr))) this.nrotimbrado = `${nrotimbradoStr}`;
    if(this.nrotimbrado != 'nuevo') this.cargarDatos();
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.form.controls.fechaVencimiento.value) {
      return false;
    }
    return startValue.getTime() > this.form.controls.fechaVencimiento.value.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.form.controls.fechaInicio.value) {
      return false;
    }
    return endValue.getTime() <= this.form.controls.fechaInicio.value.getTime();
  };

  guardar(){
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if(!this.form.valid) return;
    if(this.nrotimbrado == 'nuevo') this.registrar();
    else this.editar();
  }

  private registrar(){
    this.guardando = true;
    this.timbradosSrv
      .post(this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe(() => {
        this.notif.success(`<strong>Éxito</strong>`, 'Timbrado registrado');
        this.form.reset();
      })
  }

  private editar(){
    this.guardando = true;
    this.timbradosSrv
      .put(Number(this.nrotimbrado), this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe(() => {
        this.notif.success(`<strong>Éxito</strong>`, 'Timbrado editado');
        this.nrotimbrado = `${this.form.controls.nrotimbrado.value}`;
        this.router.navigate([this.nrotimbrado], { relativeTo: this.aroute.parent });
      })
  }

  private getDto(): TimbradoDTO{
    return {
      nrotimbrado: this.form.controls.nrotimbrado.value ?? -1,
      fechainiciovigencia: this.form.controls.fechaInicio.value?.toISOString() ?? '',
      fechavencimiento: this.form.controls.fechaVencimiento.value?.toISOString(),
      electronico: this.form.controls.electronico.value ?? true,
      activo: this.form.controls.activo.value ?? true,
      eliminado: false
    }
  }

  cargarDatos(){
    this.cargandoDatos = true;
    this.timbradosSrv
      .getByNroTimbrado(Number(this.nrotimbrado))
      .pipe(finalize(() => this.cargandoDatos = false))
      .subscribe(timbrado => {
        this.form.controls.nrotimbrado.setValue(timbrado.nrotimbrado);
        this.form.controls.fechaInicio.setValue(new Date(timbrado.fechainiciovigencia));
        if(timbrado.fechavencimiento)
          this.form.controls.fechaVencimiento.setValue(new Date(timbrado.fechavencimiento));
        this.form.controls.electronico.setValue(timbrado.electronico);
        this.form.controls.activo.setValue(timbrado.activo);
      })
  }

}
