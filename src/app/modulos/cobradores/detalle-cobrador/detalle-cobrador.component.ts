import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CobradoresService } from './../../../servicios/cobradores.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { Funcionario } from '@dto/funcionario.dto';

@Component({
  selector: 'app-detalle-cobrador',
  templateUrl: './detalle-cobrador.component.html',
  styleUrls: ['./detalle-cobrador.component.scss']
})
export class DetalleCobradorComponent implements OnInit {

  idcobrador = 'nuevo';
  form: UntypedFormGroup = this.fb.group({
    id: [null, [Validators.required]],
    razonsocial: [null, [Validators.required, Validators.maxLength(150)]],
    ci: [null],
    dv: [null],
    telefono: [null],
    email: [null, [Validators.email]],
    activo: [false]
  });
  guardarLoading: boolean = false;
  formLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private cobradoresSrv: CobradoresService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const id = this.aroute.snapshot.paramMap.get('id');
    if (id !== null) {
      this.idcobrador = id;
      if (id !== 'nuevo') {
        this.cargarDatos();
      }
    }
  }

  cargarDatos(): void {
    this.formLoading = true;
    this.cobradoresSrv.getPorId(parseInt(this.idcobrador)).subscribe({
      next: (data) => {
        this.form.get('id')?.setValue(data.id);
        this.form.get('razonsocial')?.setValue(data.razonsocial);
        this.form.get('ci')?.setValue(data.ci);
        this.form.get('dv')?.setValue(data.dvruc);
        this.form.get('telefono')?.setValue(data.telefono);
        this.form.get('email')?.setValue(data.email);
        this.form.get('activo')?.setValue(data.activo);
        this.formLoading = false;
      },
      error: (e) => {
        console.log('Error al cargar datos');
        console.log(e);
        this.httpErrorHandler.handle(e);
        //this.notif.create('error', 'Error al cargar datos del cobrador', e.error);
        this.formLoading = false;
      }
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

  private getDto(): Funcionario {
    const ci = this.form.get('ci')?.value;
    const dvruc = this.form.get('dv')?.value;
    const telefono = this.form.get('telefono')?.value;
    const email = this.form.get('email')?.value;

    const c: Funcionario = new Funcionario();
    c.id = this.form.get('id')?.value;
    c.nombres = this.form.get('razonsocial')?.value;
    c.ci = ci === '' ? null : ci;
    c.dvruc = dvruc === '' ? null : dvruc;
    c.telefono = telefono === '' ? null : telefono;
    c.email = email === '' ? null : email;
    c.activo = this.form.get('activo')?.value;
    return c;
  }

  guardar(): void {
    if (this.validado()) {
      if (this.idcobrador === 'nuevo') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.cobradoresSrv.post(this.getDto()).subscribe(() => {
      this.form.reset();
      this.notif.create('success', 'Guardado correctamente', '');
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al registrar cobrador');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const c = this.getDto();
    this.cobradoresSrv.put(+this.idcobrador, c).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.idcobrador = `${c.id}`;
      this.router.navigate([c.id], { relativeTo: this.aroute.parent });
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar cobrador');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

}
