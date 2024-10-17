import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CodigoSeguridadContribuyenteDTO } from '@dto/facturacion/codigo-seguridad-contribuyente.dto';
import { CodigoSeguridadContribuyenteService } from '@services/facturacion/codigo-seguridad-contribuyente.service';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-csc',
  templateUrl: './detalle-csc.component.html',
  styleUrls: ['./detalle-csc.component.scss']
})
export class DetalleCscComponent implements OnInit {

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 };

  idCsc: string = 'nuevo';
  cargandoDatos: boolean = false;
  guardando: boolean = false;

  form = new FormGroup({
    id: new FormControl<number | null>(null, [Validators.required]),
    codigoseguridad: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(200)]),
    activo: new FormControl<boolean>(false, Validators.required)
  });

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private cscSrv: CodigoSeguridadContribuyenteService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const idCsc = this.aroute.snapshot.paramMap.get('id');
    this.idCsc = Number.isInteger(Number(idCsc)) ? `${idCsc}` : 'nuevo';
    if(this.idCsc != 'nuevo') this.cargarDatos(Number(this.idCsc));
  }

  private cargarDatos(id: number){
    this.cargandoDatos = false;
    this.cscSrv.getById(id)
    .pipe(finalize(() => this.cargandoDatos = false))
    .subscribe(csc => {
      this.form.controls.id.setValue(csc.id);
      this.form.controls.codigoseguridad.setValue(csc.codigoseguridad);
      this.form.controls.activo.setValue(csc.activo);
    });
  }

  public guardar(){
    Object.keys(this.form.controls).forEach(ctrl => {
      this.form.get(ctrl)?.markAsDirty();
      this.form.get(ctrl)?.updateValueAndValidity();
    });
    if(!this.form.valid) return;
    if(this.idCsc == 'nuevo') this.registrar();
    else this.editar(Number(this.idCsc));
  }

  private registrar(){
    this.guardando = true;
    this.cscSrv.post(this.getDTO())
    .pipe(finalize(() => this.guardando = false))
    .subscribe(() => this.notif.success(`<strong>Éxito</strong>`, 'Código de Seguridad del Contribuyente registrado'));
  }

  private editar(id: number){
    this.guardando = true;
    this.cscSrv.put(id, this.getDTO())
    .pipe(finalize(() => this.guardando = false))
    .subscribe(() => this.notif.success(`<strong>Éxito</strong>`, 'Código de Seguridad del Contribuyente editado'));
  }

  private getDTO(): CodigoSeguridadContribuyenteDTO{
    return {
      id: Number(this.form.controls.id.value),
      codigoseguridad: this.form.controls.codigoseguridad.value ?? '',
      activo: this.form.controls.activo.value ?? false
    }
  }

}
