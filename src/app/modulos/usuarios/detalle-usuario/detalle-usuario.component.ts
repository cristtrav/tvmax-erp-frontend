import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UsuariosService } from './../../../servicios/usuarios.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { Funcionario } from '@dto/funcionario.dto';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss']
})
export class DetalleUsuarioComponent implements OnInit {

  idusuario = 'nuevo';
  form: UntypedFormGroup = this.fb.group({
    id: [null, [Validators.required]],
    nombres: [null, [Validators.required, Validators.maxLength(80)]],
    apellidos: [null, [Validators.required, Validators.maxLength(80)]],
    ci: [null, [Validators.required, Validators.maxLength(10)]],
    email: [null, [Validators.maxLength(120), Validators.email]],
    telefono: [null, [Validators.maxLength(20)]],
    password: [null, [Validators.required, Validators.minLength(5)]],
    activo: [false]
  });

  pwdVisible: boolean = false;
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  pwdRequired: boolean = true;

  constructor(
    private fb: UntypedFormBuilder,
    private usuarioSrv: UsuariosService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const idusu = this.aroute.snapshot.paramMap.get('idusuario');
    if (idusu) {
      this.idusuario = idusu;
      if (idusu !== 'nuevo') {
        this.cargarDatos();
      }
    }
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.usuarioSrv.getPorId(+this.idusuario).subscribe((data) => {
      this.form.get('id')?.setValue(data.id);
      this.form.get('nombres')?.setValue(data.nombres);
      this.form.get('apellidos')?.setValue(data.apellidos);
      this.form.get('ci')?.setValue(data.ci);
      this.form.get('email')?.setValue(data.email);
      this.form.get('telefono')?.setValue(data.telefono);
      this.form.get('activo')?.setValue(data.activo);
      this.pwdRequired = false;
      this.form.get('password')?.setValidators([Validators.minLength(5)]);
      this.formLoading = false;
    }, (e) => {
      console.log('Error al cargar datos del usuario');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos del usuario', e.error);
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
      if (this.idusuario === 'nuevo') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
  }

  private getDto(): Funcionario {
    const u: Funcionario = new Funcionario();
    u.id = this.form.get('id')?.value;
    u.nombres = this.form.get('nombres')?.value;
    u.apellidos = this.form.get('apellidos')?.value;
    u.ci = this.form.get('ci')?.value;
    u.email = this.form.get('email')?.value;
    u.telefono = this.form.get('telefono')?.value;
    u.password = this.form.get('password')?.value;
    u.activo = this.form.get('activo')?.value;
    return u;
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.usuarioSrv.post(this.getDto()).subscribe(() => {
      this.notif.create('success', 'Usuario guardado correctamente', '');
      this.form.reset();
      this.guardarLoading = false;
      this.form.get('activo')?.setValue(false);
    }, (e) => {
      console.log('Error al registrar usuario');
      console.log(e);
      this.httpErrorHandler.handle(e);;
      //this.notif.create('error', 'Error al guardar usuario', e.error);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const usu: Funcionario = this.getDto();
    this.usuarioSrv.put(+this.idusuario, usu).subscribe(() => {
      this.notif.create('success', 'Usuario guardado correctamente', '');
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar usuario');
      console.log(e);
      this.httpErrorHandler.handle(e);
      //this.notif.create('error', 'Error al guardar usuario', e.error);
      this.guardarLoading = false;
    });
  }

}
