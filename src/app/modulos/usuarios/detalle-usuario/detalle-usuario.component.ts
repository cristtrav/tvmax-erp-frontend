import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { UsuarioDTO } from '@dto/usuario.dto';
import { RolDTO } from '@dto/rol.dto';
import { RolesService } from '@servicios/roles.service';
import { HttpParams } from '@angular/common/http';
import { UsuariosService } from '@servicios/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { Subscription, finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss']
})
export class DetalleUsuarioComponent implements OnInit, OnDestroy {

  idusuario = 'nuevo';
  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    nombres: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    apellidos: new FormControl(null, [Validators.maxLength(80)]),
    ci: new FormControl(null, [Validators.maxLength(10)]),
    email: new FormControl(null, [Validators.maxLength(120), Validators.email]),
    telefono: new FormControl(null, [Validators.maxLength(20)]),
    password: new FormControl(null, [Validators.minLength(5)]),
    accesosistema: new FormControl(false, [Validators.required]),
    idroles: new FormControl(null, [Validators.required])
  });

  pwdVisible: boolean = false;
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  pwdRequired: boolean = false;
  lastIdLoading: boolean = false;
  listaRoles: RolDTO[] = [];
  accesoSistema: boolean = false;

  accesoSistemaSuscription!: Subscription;
  passwordSuscription!: Subscription;

  constructor(
    private usuarioSrv: UsuariosService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private rolesSrv: RolesService
  ) { }

  ngOnDestroy(): void {
    this.accesoSistemaSuscription.unsubscribe();
    this.passwordSuscription.unsubscribe();
  }

  ngOnInit(): void {
    this.idusuario = this.aroute.snapshot.paramMap.get('idusuario') ?? 'nuevo';
    this.cargarRoles();
    this.accesoSistemaSuscription = this.form.controls.accesosistema.valueChanges.subscribe(acceso => {
      this.updateAcesoControlRequiredValidator(acceso);
      this.updatePwdControlRequiredValidator(acceso, this.form.controls.password.value, this.idusuario);
    })
    this.passwordSuscription = this.form.controls.password.valueChanges.subscribe(pwd => {
      this.updatePwdControlRequiredValidator(
        this.form.controls.accesosistema.value,
        pwd,
        this.idusuario
      );
    })
    if (Number.isInteger(Number(this.idusuario))) this.cargarDatos();
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
    forkJoin({
      usuario: this.usuarioSrv.getPorId(Number(this.idusuario)),
      roles: this.usuarioSrv.getRolesByUsuario(Number(this.idusuario))
    })
    .pipe(finalize(() => this.formLoading = false))
    .subscribe({
      next: (resp) => {
        this.form.controls.id.setValue(resp.usuario.id);
        this.form.controls.nombres.setValue(resp.usuario.nombres);
        this.form.controls.apellidos.setValue(resp.usuario.apellidos);
        this.form.controls.ci.setValue(resp.usuario.ci);
        this.form.controls.email.setValue(resp.usuario.email);
        this.form.controls.telefono.setValue(resp.usuario.telefono);
        this.form.controls.accesosistema.setValue(resp.usuario.accesosistema);
        this.form.controls.idroles.setValue(resp.roles.map(r => r.id));
      },
      error: (e) => {
        console.error('Error al cargar Usuario', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  guardar(): void {
    Object.keys(this.form.controls).forEach((ctrlName) => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if (this.form.valid) {
      if (this.idusuario === 'nuevo') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
  }

  private getDto(): UsuarioDTO {
    return {
      id: this.form.controls.id.value,
      nombres: this.form.controls.nombres.value,
      apellidos: this.form.controls.apellidos.value,
      ci: this.form.controls.ci.value,
      email: this.form.controls.email.value,
      telefono: this.form.controls.telefono.value,
      password: this.form.controls.password.value,
      accesosistema: this.form.controls.accesosistema.value,
      idroles: this.form.controls.idroles.value,
      eliminado: false
    }
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.usuarioSrv.post(this.getDto()).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Usuario registrado.');
        this.form.reset();
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al registrar usuario', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    this.usuarioSrv.put(Number.parseInt(this.idusuario), this.getDto()).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Usuario editado.');
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al modificar usuario', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
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
