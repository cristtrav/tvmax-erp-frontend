import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatoContribuyenteDTO } from '@dto/facturacion/dato-contribuyente.dto';
import { DatosContribuyenteService } from '@services/facturacion/datos-contribuyente.service';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-contribuyente',
  templateUrl: './detalle-contribuyente.component.html',
  styleUrls: ['./detalle-contribuyente.component.scss']
})
export class DetalleContribuyenteComponent implements OnInit {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

  form: FormGroup = new FormGroup({
    ruc: new FormControl(null, [Validators.required]),
    razonSocial: new FormControl(null, [Validators.required])
  });

  guardando: boolean = false;
  cargandoDatos: boolean = false;

  constructor(
    private datosContribuyenteSrv: DatosContribuyenteService,    
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  guardar(){
    Object.keys(this.form.controls).forEach(ctrl => {
      this.form.get(ctrl)?.markAsDirty();
      this.form.get(ctrl)?.updateValueAndValidity();
    });
    if(!this.form.valid) return;
    this.guardando = true;
    this.datosContribuyenteSrv.post(this.getDTO())
    .pipe(finalize(() => this.guardando = false))
    .subscribe({
      next: () => this.notif.success('<strong>Éxito</strong>', 'Datos guardados'),
      error: (e) => console.log('Error al guardar datos del contribuyente', e)
    })
  }

  private cargarDatos(){
    this.cargandoDatos = true;
    this.datosContribuyenteSrv.get()
    .pipe(finalize(() => this.cargandoDatos = false))
    .subscribe({
      next: (datos) => {
        this.form.controls.ruc.setValue(datos.find(d => d.clave == 'ruc')?.valor);
        this.form.controls.razonSocial.setValue(datos.find(d => d.clave == 'razon-social')?.valor);
      },
      error: (e) => console.error('Error al cargar datos del contribuyente', e)
    })
  }

  private getDTO(): DatoContribuyenteDTO[]{
    return [
      { clave: 'ruc', valor: this.form.controls.ruc.value },
      { clave: 'razon-social', valor: this.form.controls.razonSocial.value }
    ]
  }

}
