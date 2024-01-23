import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MaterialDTO } from '@dto/material.dto';
import { TipoMaterialDTO } from '@dto/tipo-material.dto';
import { MaterialesService } from '@servicios/materiales.service';
import { TiposMaterialesService } from '@servicios/tipos-materiales.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-material',
  templateUrl: './detalle-material.component.html',
  styleUrls: ['./detalle-material.component.scss']
})
export class DetalleMaterialComponent implements OnInit {
  
  idmaterial: string = 'nuevo';
  loadingLastId: boolean = false;
  guardando: boolean = false;

  lstTiposMateriales: TipoMaterialDTO[] = [];
  loadingTiposMateriales: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    idtipomaterial: new FormControl(null, [Validators.required]),
    unidadmedida: new FormControl(null, [Validators.required]),
    identificable: new FormControl(null)
  })

  constructor(
    private aroute: ActivatedRoute,
    private materialSrv: MaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private tipoMaterialSrv: TiposMaterialesService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const idm = this.aroute.snapshot.paramMap.get('idmaterial');
    this.idmaterial = !Number.isNaN(Number(idm)) ? `${idm}` : 'nuevo';
    if(this.idmaterial != 'nuevo') this.cargarDatos();
    this.cargarTiposMateriales();
    this.form.controls.identificable.valueChanges.subscribe((val) => {
      if(val) this.form.controls.unidadmedida.setValue('UD')
    });
  }

  cargarDatos(){
    this.materialSrv.getPorId(Number(this.idmaterial))
      .subscribe({
        next: (material) => {
          this.form.controls.id.setValue(material.id);
          this.form.controls.descripcion.setValue(material.descripcion);
          this.form.controls.idtipomaterial.setValue(material.idtipomaterial);
          this.form.controls.unidadmedida.setValue(material.unidadmedida);
          this.form.controls.identificable.setValue(material.identificable);
        },
        error: (e) => {
          console.error('Error al cargar datos del material', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  cargarTiposMateriales(){
    const params = new HttpParams()
    .append('eliminado', 'false')
    .append('sort', '+descripcion');
    this.loadingTiposMateriales = true;
    this.tipoMaterialSrv.get(params)
      .pipe(finalize(()=> this.loadingTiposMateriales = false))
      .subscribe({
        next: (tiposMateriales) => {
          this.lstTiposMateriales = tiposMateriales;
        },
        error: (e) => {
          console.error('Error al consultar tipos de materiales', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  generarId(){
    this.loadingLastId = true
    this.materialSrv.getLastId()
      .pipe(finalize(()=>this.loadingLastId = false))
      .subscribe({
        next: (id) => {
          this.form.controls.id.setValue(id < 9 ? 10 : id + 1);
        },
        error: (e) => {
          console.error('Error al consultar ultimo id de material', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  guardar(){
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.updateValueAndValidity();
    });
    if(this.form.valid && this.idmaterial == 'nuevo') this.registrar();
    if(this.form.valid && this.idmaterial != 'nuevo') this.editar();
  }

  private registrar(){
    this.guardando = true;
    this.materialSrv.post(this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Material registrado.');
          this.form.reset();
        },
        error: (e) => {
          console.error('Error al registrar material', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  private editar(){
    this.guardando = true;
    this.materialSrv.put(Number(this.idmaterial), this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Material editado.');
        },
        error: (e) => {
          console.error('Error al editar material', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private getDto(): MaterialDTO{
    return {
      id: this.form.controls.id.value,
      descripcion: this.form.controls.descripcion.value,
      idtipomaterial: this.form.controls.idtipomaterial.value,
      unidadmedida: this.form.controls.unidadmedida.value,
      cantidad: 0,
      sololectura: false,
      identificable: this.form.controls.identificable.value ?? false,
      eliminado: false
    }
  }

}
