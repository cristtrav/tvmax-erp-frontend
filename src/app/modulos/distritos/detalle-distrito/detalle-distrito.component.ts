import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentosService } from './../../../servicios/departamentos.service';
import { Departamento } from './../../../dto/departamento-dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Distrito } from './../../../dto/distrito-dto';
import { DistritosService } from './../../../servicios/distritos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { ServerResponseList } from 'src/app/dto/server-response-list.dto';

@Component({
  selector: 'app-detalle-distrito',
  templateUrl: './detalle-distrito.component.html',
  styleUrls: ['./detalle-distrito.component.scss']
})
export class DetalleDistritoComponent implements OnInit {

  prefijoId: string = '##';
  iddistrito: string = 'nuevo';
  form: FormGroup = this.fb.group({
    id: [null, [Validators.required, Validators.max(9999)]],
    descripcion: [null, [Validators.required, Validators.maxLength(150)]],
    iddepartamento: [null, [Validators.required]]
  });
  formatterCod = (value: number) => value === null ? '' : `${value}`.padStart(2, '0');
  lstDep: Departamento[] = [];
  formLoading: boolean = false;
  guardarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private depSrv: DepartamentosService,
    private notif: NzNotificationService,
    private distSrv: DistritosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('id');
    this.form.get('iddepartamento')?.valueChanges.subscribe(value => {
      if (value !== null) {
        this.prefijoId = value;
      } else {
        this.prefijoId = '##';
      }
    });
    if (param !== null) {
      this.iddistrito = param;
      if (param !== 'nuevo') {
        this.cargarDatos();
      }
    }
    this.cargarDep();

  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.distSrv.getPorId(this.iddistrito).subscribe((data) => {
      this.form.get('id')?.setValue(data.id?.slice(-2));
      this.form.get('descripcion')?.setValue(data.descripcion);
      this.form.get('iddepartamento')?.setValue(data.iddepartamento);
      this.formLoading = false;
    }, (e) => {
      console.log('Error al cargar datos del distrito');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.formLoading = false;
    });
  }

  private cargarDep(): void {
    this.depSrv.get(this.getHttpQueryParamsDepartamento()).subscribe((resp: ServerResponseList<Departamento>) => {
      this.lstDep = resp.data;
    }, (e) => {
      console.log('Error al cargar departamentos');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  guardar(): void {
    if (this.validado()) {
      if (this.iddistrito === 'nuevo') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
  }

  private validado(): boolean {
    let val = true;
    Object.keys(this.form.controls).forEach((key) => {
      const ctrl = this.form.get(key);
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

  private registrar(): void {
    this.guardarLoading = true;
    this.distSrv.post(this.getDto()).subscribe(() => {
      this.form.reset();
      this.notif.create('success', 'Guardado correctamente', '');
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al registrar distrito');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    })
  }

  private modificar(): void {
    this.guardarLoading = true;
    const d = this.getDto();
    this.distSrv.put(this.iddistrito, d).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.router.navigate([d.id], { relativeTo: this.aroute.parent } );
      if (d.id !== null) {
        this.iddistrito = d.id;
      }
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar distrito');
      console.log(e);
      this.notif.create('error', 'Error al guardar', e.error);
      this.guardarLoading = false;
    });
  }

  private getDto(): Distrito {
    const dist: Distrito = new Distrito();
    const idPadded: string = `${this.form.get('id')?.value}`.padStart(2, '0');
    dist.id = `${this.form.get('iddepartamento')?.value}${idPadded}`;
    dist.descripcion = this.form.get('descripcion')?.value;
    dist.iddepartamento = this.form.get('iddepartamento')?.value;
    return dist;
  }

  getHttpQueryParamsDepartamento(): HttpParams {
    const params: HttpParams = new HttpParams().append('eliminado', 'false');
    return params;
  }

}
