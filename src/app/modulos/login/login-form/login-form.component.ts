import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SesionService } from '../../../servicios/sesion.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  pwdVisible: boolean = false;
  loginLoading: boolean = false;
  msgVisible: boolean = false;
  tituloMsg: string = 'Error al iniciar sesion';
  descripcionMsg: string = ''

  form: FormGroup = this.fb.group({
    ci: [null, [Validators.required]],
    pwd: [null, [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private sesionSrv: SesionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //this.comprobarSesion();
  }

  doLogin() {
    if (this.validado()) {
      this.loginLoading = true;
      const ci = this.form.get('ci')?.value;
      const pwd = this.form.get('pwd')?.value;
      this.sesionSrv.login(ci, pwd).subscribe((data) => {
        this.loginLoading = false;
        this.router.navigate(['/app/dashboard']);
      }, (e) => {
        console.log('Error al iniciar sesión');
        console.log(e);
        this.loginLoading = false;
        this.msgVisible = true;
        if (e.status === 500) {
          this.tituloMsg = 'Error al iniciar sesión';
          this.descripcionMsg = e.error;
        } else {
          this.tituloMsg = 'Documento y/o contraseña incorrectos.';
          this.descripcionMsg = '';
        }
      });
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

  private comprobarSesion(): void {
    const rtoken = localStorage.getItem('refreshToken');
    if (rtoken) {
      this.sesionSrv.refresh(rtoken).subscribe((data) => {
        localStorage.setItem('accessToken', data.accessToken);
        this.router.navigateByUrl('/app/welcome');
      }, (e) => {
        console.log('Error al actualizar sesion');
        console.log(e);
        switch (e.status) {
          case 500:
            this.tituloMsg = 'Error al actualizar sesión.'
            this.descripcionMsg = e.error;
            this.msgVisible = true;
            break;
          case 401:
          case 403:
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            break;
          default:
            break;
        }
      });
    }
  }

}
