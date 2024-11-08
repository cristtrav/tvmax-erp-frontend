import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '@services/clientes.service';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form-contacto-cliente',
  templateUrl: './form-contacto-cliente.component.html',
  styleUrls: ['./form-contacto-cliente.component.scss']
})
export class FormContactoClienteComponent {

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

  messageVisible: boolean = false;
  messageType: 'success' | 'error' = 'success';
  messageTitle: string = '';
  messageDescription: string = '';

  form = new FormGroup({
    telefono1: new FormControl<null | string>(null),
    telefono2: new FormControl<null | string>(null),
    email: new FormControl<null | string>(null, [Validators.email])
  });

  @Output()
  guardando: EventEmitter<boolean> = new EventEmitter();

  @Output()
  guardadoCorrecto: EventEmitter<boolean> = new EventEmitter();

  @Input()
  idcliente: number | null | undefined = null;

  @Input()
  set telefono1(telefono1: string | null | undefined){
    this.form.controls.telefono1.setValue(telefono1 ?? null);
  }

  @Input()
  set telefono2(telefono2: string | null | undefined){
    this.form.controls.telefono2.setValue(telefono2 ?? null);
  }

  @Input()
  set email(email: string | null | undefined){
    this.form.controls.email.setValue(email ?? null);
  }

  constructor(
    private clientesSrv: ClientesService
  ){}

  guardar(){
    Object.keys(this.form.controls).forEach(ctrl => {
      this.form.get(ctrl)?.markAsDirty();
      this.form.get(ctrl)?.updateValueAndValidity();
    })
    if(!this.form.valid) return;
    this.guardando.emit(true);
    this.clientesSrv.putContacto(Number(this.idcliente), this.getDto())
    .pipe(finalize(() => this.guardando.emit(false)))
    .subscribe({
      next: () => {
        this.messageType = 'success';
        this.messageTitle = 'Contacto guardado';
        this.messageDescription = '';
        this.messageVisible = true;
        this.guardadoCorrecto.emit(true);
      },
      error: (e) => {
        console.error('Error al actualizar contacto', e);
        this.messageType = 'error';
        this.messageTitle = 'Error al guardar contacto';
        this.messageDescription = e.message;
        this.messageVisible = true;
      }
    })
  }

  getDto(): { telefono1?: string, telefono2?: string, email?: string } {
    return {
      telefono1: this.form.controls.telefono1.value ?? undefined,
      telefono2: this.form.controls.telefono2.value ?? undefined,
      email: this.form.controls.email.value ?? undefined
    }
  }

}
