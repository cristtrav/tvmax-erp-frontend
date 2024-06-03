import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SesionService } from '@services/sesion.service';
import { UsuariosService } from '@services/usuarios.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-form-cambio-password',
  templateUrl: './form-cambio-password.component.html',
  styleUrls: ['./form-cambio-password.component.scss']
})
export class FormCambioPasswordComponent implements OnInit {

  @Output()
  guardado = new EventEmitter<boolean>()

  @Output()
  guardarLoading = new EventEmitter<boolean>(false);

  oldPasswordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  errorAlertVisible: boolean = false;
  errorAlertMessage: string = '';

  form: FormGroup = new FormGroup({
    oldPass: new FormControl(null, [Validators.required]),
    newPass: new FormControl(null, [Validators.required, Validators.minLength(6)])
  })

  constructor(
    private usuarioSrv: UsuariosService,
    private sesionSrv: SesionService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
  }

  guardar() {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    })
    if (this.form.valid) {
      this.guardarLoading.emit(true);
      this.usuarioSrv.changePassword(
        this.sesionSrv.idusuario,
        this.form.controls.oldPass.value,
        this.form.controls.newPass.value
      ).subscribe({
        next: () => {
          this.errorAlertVisible = false;
          this.notif.create('success', '<strong>Éxito</strong>', 'Contraseña guardada.');
          this.guardarLoading.emit(false);
          this.guardado.emit(true);
        },
        error: (e) => {
          this.guardarLoading.emit(false);
          console.error('Error al guardar contraseña', e);
          this.errorAlertVisible = true;
          this.errorAlertMessage = e.error.message;
        }
      })
    }
  }

}
