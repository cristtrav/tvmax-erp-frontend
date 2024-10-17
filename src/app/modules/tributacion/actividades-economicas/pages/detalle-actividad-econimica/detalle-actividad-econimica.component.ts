import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadEconomicaDTO } from '@dto/facturacion/actividad-economica.dto';
import { ActividadesEconomicasService } from '@services/facturacion/actividades-economicas.service';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-actividad-econimica',
  templateUrl: './detalle-actividad-econimica.component.html',
  styleUrls: ['./detalle-actividad-econimica.component.scss']
})
export class DetalleActividadEconimicaComponent implements OnInit {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 };
  
  idactividad: string = 'nueva';
  cargandoDatos: boolean = false;
  guardando: boolean = false;

  form = new FormGroup({
    id: new FormControl<string | null>(null, [Validators.required]),
    descripcion: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(150)])
  });

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private actividadesEconomicasSrv: ActividadesEconomicasService,    
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const idactividad = this.aroute.snapshot.paramMap.get('idactividad');
    this.idactividad = idactividad != null ? `${idactividad}` : 'nueva';
    if(this.idactividad != 'nueva') this.cargarDatos(this.idactividad);
  }

  cargarDatos(id: string){
    this.cargandoDatos = true;
    this.actividadesEconomicasSrv.getById(id)
    .pipe(finalize(() => this.cargandoDatos = this.cargandoDatos = false))
    .subscribe({
      next: (actividad) => {
        this.form.controls.id.setValue(actividad.id);
        this.form.controls.descripcion.setValue(actividad.descripcion);
      },
      error: (e) => console.error('Error al cargar actividad economica on id', id, e)
    })
  }

  guardar(){
    Object.keys(this.form.controls).forEach(ctrl => {
      this.form.get(ctrl)?.markAsDirty();
      this.form.get(ctrl)?.updateValueAndValidity();
    });
    if(!this.form.valid) return;
    if(this.idactividad == 'nueva') this.registrar();
    else this.editar();
  }

  private registrar(){
    this.guardando = true;
    this.actividadesEconomicasSrv.post(this.getDTO())
    .pipe(finalize(() => this.guardando = false))
    .subscribe({
      next: () => {
        this.notif.success(`<strong>Éxito</strong>`, 'Actividad económica guardada');
        this.form.reset();
      },
      error: (e) => console.error('Error al registrar actividad económica', e)
    });
  }

  private editar(){
    this.guardando = true;
    this.actividadesEconomicasSrv.put(this.idactividad, this.getDTO())
    .pipe(finalize(() => this.guardando = false))
    .subscribe({
      next: () => {
        this.notif.success(`<strong>Éxito</strong>`, 'Actividad económica editada');
        this.idactividad = `${this.form.controls.id.value}`;
        this.router.navigate([this.idactividad], {relativeTo: this.aroute.parent});
        this.cargarDatos(this.idactividad);
      },
      error: (e) => console.error('Error al editar actividad económica', e)
    });
  }

  private getDTO(): ActividadEconomicaDTO{
    return {
      id: this.form.controls.id.value ?? '0',
      descripcion: this.form.controls.descripcion.value ?? ''
    }
  }

}
