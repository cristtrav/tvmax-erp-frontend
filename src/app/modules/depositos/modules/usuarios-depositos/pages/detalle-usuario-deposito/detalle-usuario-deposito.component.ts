import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioDTO } from '@dto/usuario.dto';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { UsuariosService } from '@global-services/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-usuario-deposito',
  templateUrl: './detalle-usuario-deposito.component.html',
  styleUrls: ['./detalle-usuario-deposito.component.scss']
})
export class DetalleUsuarioDepositoComponent implements OnInit {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTIONS_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12} as const;

  idusuario: string = 'nuevo';
  loadingId: boolean = false;
  guardando: boolean = false;
  loading: boolean = false;

  usuarioEditar!: UsuarioDTO;
  
  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    nombres: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    apellidos: new FormControl(null, [Validators.maxLength(80)]),
    roles: new FormControl<number[]>([], [Validators.required])
  })

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private usuariosSrv: UsuariosService,
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
    this.usuariosSrv
    .getLastId()
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
    this.usuariosSrv
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
    this.usuariosSrv
    .put(Number(this.idusuario), this.getDtoEdicion())
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

  private getDto(): UsuarioDTO{
    return {
      id: this.form.controls.id.value,
      nombres: this.form.controls.nombres.value,
      apellidos: this.form.controls.apellidos.value,
      idroles: this.form.controls.roles.value,
      accesosistema: false,
      eliminado: false
    }
  }

  private getDtoEdicion(): UsuarioDTO{
    return {
      ...this.usuarioEditar,
      id: this.form.controls.id.value,
      nombres: this.form.controls.nombres.value,
      apellidos: this.form.controls.apellidos.value,
      idroles: this.form.controls.roles.value.concat((this.usuarioEditar.idroles ?? []).filter(idr => idr != 7 && idr != 8))
    }
  }

  cargarDatos(id: number){
    this.loading = true;
    this.usuariosSrv
    .getPorId(id)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (usuario) => {
        this.usuarioEditar = usuario;
        this.form.controls.id.setValue(usuario.id);
        this.form.controls.nombres.setValue(usuario.nombres);
        this.form.controls.apellidos.setValue(usuario.apellidos);
        this.form.controls.roles.setValue((usuario.idroles ?? []).filter(idr => idr == 7 || idr == 8));
      },
      error: (e) => {
        console.error('Error al cargar usuario de deposito por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

}
