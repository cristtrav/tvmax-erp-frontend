import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from './../../../servicios/usuarios.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { Usuario } from '@dto/usuario.dto';
import { RolDTO } from '@dto/rol.dto';
import { RolesService } from '@servicios/roles.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss']
})
export class DetalleUsuarioComponent implements OnInit {

  idusuario = 'nuevo';
  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    nombres: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    apellidos: new FormControl(null, [Validators.maxLength(80)]),
    ci: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    email: new FormControl(null, [Validators.maxLength(120), Validators.email]),
    telefono: new FormControl(null, [Validators.maxLength(20)]),
    password: new FormControl(null, [Validators.minLength(5)]),
    accesosistema: new FormControl(false, [Validators.required]),
    idrol: new FormControl(null, [Validators.required])
  });

  pwdVisible: boolean = false;
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  pwdRequired: boolean = false;
  lastIdLoading: boolean = false;
  listaRoles: RolDTO[] = [];
  accesoSistema: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private usuarioSrv: UsuariosService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private rolesSrv: RolesService
  ) { }

  ngOnInit(): void {
    this.idusuario = this.aroute.snapshot.paramMap.get('idusuario') ?? 'nuevo';
    this.cargarRoles();
    this.form.controls.accesosistema.valueChanges.subscribe(acceso => {
      this.updateAcesoControlRequiredValidator(acceso);
      this.updatePwdControlRequiredValidator(acceso, this.form.controls.password.value, this.idusuario);
    })
    this.form.controls.password.valueChanges.subscribe(pwd => {
      this.updatePwdControlRequiredValidator(
        this.form.controls.accesosistema.value,
        pwd,
        this.idusuario
      );
    })
    if (!Number.isNaN(Number(this.idusuario))) this.cargarDatos();
  }

  private updateAcesoControlRequiredValidator(acceso: boolean) {
    if (acceso)
      this.form.controls.ci.addValidators(Validators.required);
    else
      this.form.controls.ci.removeValidators(Validators.required);
  }

  private updatePwdControlRequiredValidator(acceso: boolean, pwd: string, idusuario: string) {
    this.pwdRequired = this.isPwdRequired(acceso, idusuario, pwd);
    if (this.pwdRequired && !this.form.controls.password.hasValidator(Validators.required)) {
      this.form.controls.password.addValidators(Validators.required);
    } else if (this.form.controls.password.hasValidator(Validators.required)) {
      this.form.controls.password.removeValidators(Validators.required);
      
      //To update validation msg and prevent "too much recursion" exception
      if (pwd === '') this.form.controls.password.updateValueAndValidity();
    }
  }
  private isPwdRequired(acceso: boolean, idusuario: string, password: string): boolean {
    if (acceso && idusuario === 'nuevo') return true;
    if (acceso && idusuario !== 'nuevo' && password) return true;
    return false
  }

  private cargarRoles() {
    const params = new HttpParams()
      .append('eliminado', 'false')
      .append('sort', '+descripcion');

    this.rolesSrv.get(params).subscribe({
      next: (roles) => {
        this.listaRoles = roles;
      },
      error: (e) => {
        console.error('Error al cargar roles', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.usuarioSrv.getPorId(Number(this.idusuario)).subscribe({
      next: (usuario) => {
        this.form.controls.id.setValue(usuario.id);
        this.form.controls.nombres.setValue(usuario.nombres);
        this.form.controls.apellidos.setValue(usuario.apellidos);
        this.form.controls.ci.setValue(usuario.ci);
        this.form.controls.email.setValue(usuario.email);
        this.form.controls.telefono.setValue(usuario.telefono);
        this.form.controls.accesosistema.setValue(usuario.accesosistema);
        this.form.controls.idrol.setValue(usuario.idrol);
        this.formLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar Usuario', e);
        this.httpErrorHandler.process(e);
        this.formLoading = false;
      }
    })
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

  private getDto(): Usuario {
    const u: Usuario = new Usuario();
    u.id = this.form.controls.id.value;
    u.nombres = this.form.controls.nombres.value;
    u.apellidos = this.form.controls.apellidos.value;
    u.ci = this.form.controls.ci.value;
    u.email = this.form.controls.email.value;
    u.telefono = this.form.controls.telefono.value;
    u.password = this.form.controls.password.value;
    u.accesosistema = this.form.controls.accesosistema.value;
    u.idrol = this.form.controls.idrol.value;
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
    const usu: Usuario = this.getDto();
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

  public generarId() {
    this.lastIdLoading = true;
    this.usuarioSrv.getLastId().subscribe({
      next: (lastid) => {
        this.form.controls.id.setValue(lastid + 1);
        this.lastIdLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar el ultimo ID de Usuario', e);
        this.httpErrorHandler.process(e);
        this.lastIdLoading = false;
      }
    })
  }

}
