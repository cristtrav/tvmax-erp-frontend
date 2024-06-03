import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { GruposService } from '@services/grupos.service';
import { ServiciosService } from '@services/servicios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { finalize } from 'rxjs';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.scss']
})
export class DetalleServicioComponent implements OnInit {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveUtils = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACCION_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm:24, md: 12, lg: 12, xl: 12, xxl: 12 } as const;

  idservicio = 'nuevo';
  lstGrupos: Grupo[] = [];
  form = new FormGroup({
    id: new FormControl<number | null>(null, [Validators.required]),
    descripcion: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    idgrupo: new FormControl<number | null>(null, [Validators.required]),
    precio: new FormControl<number | null>(null, [Validators.required]),
    suscribible: new FormControl<boolean | null>(false, [Validators.required])
  });
  formLoading: boolean = false;
  guardarLoading: boolean = false;
  lastIdLoading: boolean = false;

  constructor(
    private gruposSrv: GruposService,
    private notif: NzNotificationService,
    private serviciosSrv: ServiciosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService
    ) { }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('id');
    this.idservicio = param !== null?param:'nuevo';
    this.cargarGrupos();
    if(this.idservicio!=='nuevo'){
      this.cargarServicio();
    }
  }

  private cargarServicio(){
    this.formLoading = true;
    this.serviciosSrv
      .getServicioPorId(Number(this.idservicio))
      .pipe(finalize(() => this.formLoading = false))
      .subscribe({
        next: (data) => {
          this.form.controls.id.setValue(data.id ?? null);
          this.form.controls.descripcion.setValue(data.descripcion ?? null);
          this.form.controls.idgrupo.setValue(data.idgrupo ?? null);
          this.form.controls.precio.setValue(data.precio ?? null);
          this.form.controls.suscribible.setValue(data.suscribible ?? null);
        },
        error: (e) => {
          console.error('Error al cargar datos de servicio', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private cargarGrupos(): void{
    this.gruposSrv
      .getGrupos(this.getQueryParamsGrupos())
      .subscribe({
        next: (grupos) => {
          this.lstGrupos = grupos;
        },
        error: (e) => {
          console.error('Error al cargar grupos', e);
          this.httpErrorHandler.process(e);
        }
    });
  }

  getDto(): Servicio {
    return {
      id: this.form.controls.id.value ?? undefined,
      descripcion: this.form.controls.descripcion.value ?? undefined,
      idgrupo: this.form.controls.idgrupo.value ?? undefined,
      precio: this.form.controls.precio.value ?? undefined,
      suscribible: this.form.controls.suscribible.value ?? undefined
    }
  }

  guardar(): void {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if(this.form.valid && this.idservicio == 'nuevo') this.registrar();
    if(this.form.valid && Number.isInteger(Number(this.idservicio))) this.modificar();
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.serviciosSrv
      .postServicio(this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.success('Guardado correctamente','');
          this.form.reset();
        },
        error: (e) => {
          console.error('Error al registrar Servicio', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private modificar(): void{
    this.guardarLoading = true;
    this.serviciosSrv
      .putServicio(Number(this.idservicio), this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.success('Guardado correctamente', '');
          this.idservicio = `${this.form.controls.id.value}`;
          this.router.navigate([this.form.controls.id.value], {relativeTo: this.aroute.parent});
        },
        error: (e) => {
          console.error('Error al modificar Servicio', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  getQueryParamsGrupos(): HttpParams{
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    return params;
  }

  cargarId(): void{
    this.lastIdLoading = true;
    this.serviciosSrv.getLastId()
      .pipe(finalize(() => this.lastIdLoading = false))
      .subscribe({
        next: (id) => {
          this.form.get('id')?.setValue(id+1);          
        },
        error: (e) => {
          console.error('Error al consultar ultimo ID de servicios', e);
          this.httpErrorHandler.process(e);
        }
    });
  }

}

