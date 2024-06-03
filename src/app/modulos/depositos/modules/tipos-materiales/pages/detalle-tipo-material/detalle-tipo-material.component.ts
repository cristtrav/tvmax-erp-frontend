import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TipoMaterialDTO } from '@dto/tipo-material.dto';
import { TiposMaterialesService } from '@global-services/depositos/tipos-materiales.service';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-tipo-material',
  templateUrl: './detalle-tipo-material.component.html',
  styleUrls: ['./detalle-tipo-material.component.scss']
})
export class DetalleTipoMaterialComponent implements OnInit {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 } as const;

  idtipomaterial: string = 'nuevo';
  guardando: boolean = false;
  loadingLastId: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required, Validators.maxLength(45)])
  }); 

  constructor(
    private aroute: ActivatedRoute,
    private tipoMaterialSrv: TiposMaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const idtipoStr = this.aroute.snapshot.paramMap.get('idtipo')
    this.idtipomaterial = !Number.isNaN(Number(idtipoStr)) ? `${idtipoStr}` : 'nuevo';
    if(this.idtipomaterial != 'nuevo') this.cargarDatos();
  }

  cargarDatos(){
    this.tipoMaterialSrv.getPorId(Number(this.idtipomaterial)).subscribe({
      next: (tm) => {
        this.form.controls.id.setValue(tm.id);
        this.form.controls.descripcion.setValue(tm.descripcion);
      },
      error: (e) => {
        console.error('Error al consultar tipo de material por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  guardar(){
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.updateValueAndValidity();
    });
    if(this.form.valid && this.idtipomaterial == 'nuevo') this.registrar();
    if(this.form.valid && this.idtipomaterial != 'nuevo') this.editar();
  }

  private registrar(){
    this.guardando = true;
    this.tipoMaterialSrv.post(this.getDto())
    .pipe(
      finalize(() => this.guardando = false)
    )
    .subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Tipo de material registrado correctamente.');
        this.form.reset();
      },
      error: (e) => {
        console.error('Error al registrar tipo material', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private editar(){
    this.guardando = true;
    this.tipoMaterialSrv
      .put(Number(this.idtipomaterial), this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Tipo de material editado.');
        },
        error: (e) => {
          console.error('Error al editar Tipo de Material', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  getDto(): TipoMaterialDTO {
    return {
      id: this.form.controls.id.value,
      descripcion: this.form.controls.descripcion.value,
      sololectura: false,
      eliminado: false
    }
  }

  generarId(){
    this.loadingLastId = true;
    this.tipoMaterialSrv.getLastId()
    .pipe(
      finalize(() => this.loadingLastId = false)
    )
    .subscribe({
      next: (lastId) => {
        this.form.controls.id.setValue(lastId > 9 ? lastId + 1 : 10);
      },
      error: (e) => {
        console.error('Error al consultar ultimo id de tipo de materiales', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

}
