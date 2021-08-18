import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Departamento } from './../../../dto/departamento-dto';
import { DepartamentosService } from './../../../servicios/departamentos.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';

@Component({
  selector: 'app-detalle-departamento',
  templateUrl: './detalle-departamento.component.html',
  styleUrls: ['./detalle-departamento.component.scss']
})
export class DetalleDepartamentoComponent implements OnInit {

  iddepartamento = 'nuevo';
  form: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    descripcion: [null, [Validators.required, Validators.maxLength(80)]],
  });
  formLoading: boolean = false;
  guardarLoading: boolean = false;

  formatterCod = (value: number) => value === null ? '' : `${value}`.padStart(2, '0');

  constructor(
    private fb: FormBuilder,
    private depSrv: DepartamentosService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('id');
    if (param !== null) {
      this.iddepartamento = param;
      if (this.iddepartamento !== 'nuevo') {
        this.cargarDatos();
      }
    }

  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.depSrv.getPorId(this.iddepartamento).subscribe((data)=>{
      this.form.get('id')?.setValue(data.id);
      this.form.get('descripcion')?.setValue(data.descripcion);
      this.formLoading = false;
    }, (e)=>{
      console.log('Error al cargar departamento');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.formLoading = false;
    });
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

  guardar(): void {
    if (this.validado()) {
      if (this.iddepartamento === 'nuevo') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.depSrv.post(this.getDto()).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.form.reset();
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al registrar departamento');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const d: Departamento = this.getDto();
    this.depSrv.put(this.iddepartamento, d).subscribe(()=>{
      this.notif.create('success', 'Guardado correctamente', '');
      this.iddepartamento = `${d.id}`;
      this.router.navigate([d.id], {relativeTo: this.aroute.parent});
      this.guardarLoading = false;
    }, (e)=>{
      console.log('Error al modificar departamento');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private getDto(): Departamento {
    const d: Departamento = new Departamento();
    d.id = `${this.form.get('id')?.value}`.padStart(2, '0');
    d.descripcion = this.form.get('descripcion')?.value;
    return d;
  }

}
