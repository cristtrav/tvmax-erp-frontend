import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioDepositoDTO } from '@dto/usuario-deposito.dto';
import { UsuariosDepositosService } from '@servicios/usuarios-depositos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-usuario-deposito',
  templateUrl: './detalle-usuario-deposito.component.html',
  styleUrls: ['./detalle-usuario-deposito.component.scss']
})
export class DetalleUsuarioDepositoComponent implements OnInit {

  idusuario: string = 'nuevo';
  loadingId: boolean = false;
  guardando: boolean = false;
  loading: boolean = false;
  
  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    razonsocial: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    rol: new FormControl(null, [Validators.required])
  })

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private usuariosDepositosSrv: UsuariosDepositosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const idusuarioStr = this.aroute.snapshot.paramMap.get('idusuariodepositos');
    if(Number.isInteger(Number(idusuarioStr))){
      this.idusuario = `${idusuarioStr}`;
      this.cargarDatos(Number(idusuarioStr));
    } else this.idusuario = 'nuevo';
  }

  generarId(){
    this.loadingId = true;
    this.usuariosDepositosSrv
    .getUltimoId()
    .pipe(finalize(() => this.loadingId = false))
    .subscribe({
      next: (ultimoId) => {
        this.form.controls.id.setValue(ultimoId > 9 ? ultimoId + 1 : 10);
      },
      error: (e) => {
        console.error('Error al cargar ultimo ID', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  guardar(){
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.updateValueAndValidity();
    });
    if(this.form.valid){
      if(this.idusuario == 'nuevo') this.registrar();
      else this.editar();
    }    
  }

  private registrar(){
    this.guardando = true;
    this.usuariosDepositosSrv
    .post(this.getDto())
    .pipe(finalize(() => this.guardando = false))
    .subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Usuario registrado.');
        this.form.reset();
      },
      error: (e) => {
        console.error('Error al registrar usuario de depositos', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private editar(){
    this.guardando = true;
    this.usuariosDepositosSrv
    .put(Number(this.idusuario), this.getDto())
    .pipe(finalize(() => this.guardando = false))
    .subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Usuario editado.');
        this.idusuario = `${this.form.controls.id.value}`;
        this.router.navigate([this.idusuario], {relativeTo: this.aroute.parent});
      },
      error: (e) => {
        console.error('Error al editar usuario de depositos', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private getDto(): UsuarioDepositoDTO{
    return {
      id: this.form.controls.id.value,
      razonsocial: this.form.controls.razonsocial.value,
      rol: this.form.controls.rol.value,
      eliminado: false
    }
  }

  cargarDatos(id: number){
    this.loading = true;
    this.usuariosDepositosSrv
    .getPorId(id)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (usuario) => {
        this.form.controls.id.setValue(usuario.id);
        this.form.controls.razonsocial.setValue(usuario.razonsocial);
        this.form.controls.rol.setValue(usuario.rol);
      },
      error: (e) => {
        console.error('Error al cargar usuario de deposito por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

}
