import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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

  form: FormGroup = new FormGroup({
    ci: new FormControl(null, [Validators.required]),
    pwd: new FormControl(null, [Validators.required])
  });

  constructor(
    private sesionSrv: SesionService,
    private router: Router
  ) { }

  ngOnInit(): void {    
  }

  doLogin() {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    })
    if (this.form.valid) {
      this.loginLoading = true;
      const ci = this.form.controls.ci.value;
      const pwd = this.form.controls.pwd.value;
      this.sesionSrv.login(ci, pwd).subscribe({
        next: () => {
          this.loginLoading = false;
          this.router.navigate(['/app', 'dashboard']);
        },
        error: (e) => {
          this.loginLoading = false;
          this.msgVisible = true;
          console.log('Error al iniciar sesion', e);
          if (e.status === 500) {
            this.tituloMsg = 'Error al iniciar sesión';
            this.descripcionMsg = e.error;
          } else {
            this.tituloMsg = 'Documento y/o contraseña incorrectos.';
            this.descripcionMsg = '';
          }
        }
      });
    }

  }

}
