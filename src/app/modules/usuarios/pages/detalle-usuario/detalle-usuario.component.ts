import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '@services/usuarios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { Subscription, finalize, forkJoin } from 'rxjs';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { UsuarioDTO } from '@dto/usuario.dto';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss']
})
export class DetalleUsuarioComponent implements OnInit, OnDestroy {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 12, lg: 12, xl: 24, xxl: 25 } as const;

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
  });

  pwdVisible: boolean = false;
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  pwdRequired: boolean = false;
  lastIdLoading: boolean = false;
  accesoSistema: boolean = false;

  accesoSistemaSuscription!: Subscription;
  passwordSuscription!: Subscription;

  constructor(
    private usuarioSrv: UsuariosService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnDestroy(): void {
    this.accesoSistemaSuscription.unsubscribe();
    this.passwordSuscription.unsubscribe();
  }

  ngOnInit(): void {
    this.idusuario = this.aroute.snapshot.paramMap.get('idusuario') ?? 'nuevo';
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
    if (acceso) this.form.controls.ci.addValidators(Validators.required);
    else this.form.controls.ci.removeValidators(Validators.required);
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
    if(this.form.valid && this.idusuario == 'nuevo') this.registrar();
    if(this.form.valid && this.idusuario != 'nuevo') this.modificar();
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
      eliminado: false
    }
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.usuarioSrv
      .post(this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Usuario registrado.');
        this.form.reset();
      },
      error: (e) => {
        console.error('Error al registrar usuario', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    this.usuarioSrv
      .put(Number.parseInt(this.idusuario), this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Usuario editado.');
      },
      error: (e) => {
        console.error('Error al modificar usuario', e);
        this.httpErrorHandler.process(e);
      }
    });    
  }

  public generarId() {
    this.lastIdLoading = true;
    this.usuarioSrv
      .getLastId()
      .pipe(finalize(() => this.lastIdLoading = false))
      .subscribe({
        next: (lastid) => this.form.controls.id.setValue(lastid + 1),
        error: (e) => {
          console.error('Error al cargar el ultimo ID de Usuario', e);
          this.httpErrorHandler.process(e);
      }
    })
  }

}
