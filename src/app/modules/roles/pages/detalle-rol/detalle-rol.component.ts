import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolDTO } from '@dto/rol.dto';
import { RolesService } from '@global-services/roles.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-detalle-rol',
  templateUrl: './detalle-rol.component.html',
  styleUrls: ['./detalle-rol.component.scss']
})
export class DetalleRolComponent implements OnInit {

  idrol: string = 'nuevo'; // 'nuevo' => Se registra | Valor numérico => Se edita
  formLoading: boolean = false;
  guardando: boolean = false;
  lastIdLoading: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required, Validators.maxLength(30)])
  });

  constructor(
    private aroute: ActivatedRoute,
    private rolesSrv: RolesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notification: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idrol = this.aroute.snapshot.paramMap.get('idrol') ?? 'nuevo';
    if (!Number.isNaN(Number(this.idrol))) this.cargarRol();
  }

  private cargarRol() {
    this.formLoading = true;
    this.rolesSrv.getById(Number(this.idrol)).subscribe({
      next: (rol) => {
        this.form.controls.id.setValue(rol.id);
        this.form.controls.descripcion.setValue(rol.descripcion);
        this.formLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar rol', e);
        this.httpErrorHandler.process(e);
        this.formLoading = false;
      }
    });
  }

  guardar() {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if (this.form.valid && this.idrol === 'nuevo') this.registrar();
    if (this.form.valid && !Number.isNaN(Number(this.idrol))) this.editar();
  }

  private registrar() {
    this.guardando = true;
    this.rolesSrv.post({
      id: this.form.controls.id.value,
      descripcion: this.form.controls.descripcion.value
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.notification.create('success', '<strong>Éxito<strong>', 'Rol registrado');
        this.form.reset();
      },
      error: (e) => {
        console.error('Error al registrar Rol', e);
        this.httpErrorHandler.process(e);
        this.guardando = false;
      }
    });
  }

  private editar() {
    this.guardando = true;
    const rol: RolDTO = {
      id: this.form.controls.id.value,
      descripcion: this.form.controls.descripcion.value
    }
    this.rolesSrv.put(
      Number(this.idrol),
      rol
    ).subscribe({
      next: () => {
        this.guardando = false;
        this.notification.create('success', '<strong>Éxito</strong>', 'Rol editado');
        this.idrol = `${rol.id}`;
        this.router.navigate([rol.id], {relativeTo: this.aroute.parent});
      },
      error: (e) => {
        console.error('Error al editar rol', e);
        this.httpErrorHandler.process(e);
        this.guardando = false;
      }
    })
  }

  public generarId(){
    this.lastIdLoading = true;
    this.rolesSrv.getLastId().subscribe({
      next: (lastid) => {
        this.form.controls.id.setValue(lastid+1);
        this.lastIdLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar ultimo id de roles', e);
        this.httpErrorHandler.process(e);
        this.lastIdLoading = false;
      }
    })
  }

}
