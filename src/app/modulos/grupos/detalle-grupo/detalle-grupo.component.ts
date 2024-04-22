import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service'
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { finalize } from 'rxjs';
import { Grupo } from '@dto/grupo-dto';
import { GruposService } from '@servicios/grupos.service';

@Component({
  selector: 'app-detalle-grupos',
  templateUrl: './detalle-grupo.component.html',
  styleUrls: ['./detalle-grupo.component.scss']
})
export class DetalleGrupoComponent implements OnInit {

  readonly FORM_SIZES = ResponsiveUtils.DEFAUT_FORM_SIZES;
  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTIONS_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly ID_CONTROL_SIZES: ResponsiveSizes = { nzXs: 24, nzSm: 24, nzMd: 12, nzLg: 12, nzXl: 12, nzXXl: 12 };

  idgrupo = 'nuevo';
  fg: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required, Validators.maxLength(80)])
  });
  formLoading: boolean = false;
  guardarLoading: boolean = false;
  lastIdLoading: boolean = false;

  constructor(
    private aroute: ActivatedRoute,
    private grupoSrv: GruposService,
    private notif: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('id');
    this.idgrupo = param !== null ? param : 'nuevo';
    if(this.idgrupo !== 'nuevo') this.cargarDatos();
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.grupoSrv.getGrupoPorId(Number(this.idgrupo))
      .pipe(finalize(() => this.formLoading = false))
      .subscribe({
        next: (grupo) => {
          this.fg.controls.id.setValue(grupo.id);
          this.fg.controls.descripcion.setValue(grupo.descripcion);
        },
        error: (e) => {
          console.log('Error al cargar datos de Grupo', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private getDto(): Grupo {
    const gru: Grupo = new Grupo();
    gru.id = this.fg.get('id')?.value;
    gru.descripcion = this.fg.get('descripcion')?.value;
    return gru;
  }

  guardar(): void {
    Object.keys(this.fg.controls).forEach((ctrlName) => {
      this.fg.get(ctrlName)?.markAsDirty();
      this.fg.get(ctrlName)?.updateValueAndValidity();
    })
    if(this.fg.valid && this.idgrupo === 'nuevo')this.registrar();
    if(this.fg.valid && this.idgrupo != 'nuevo') this.modificar();
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.grupoSrv.postGrupo(this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.create('success', 'Guardado correctamente', '');
          this.fg.reset();
        },
        error: (e) => {
          console.log('Error al registrar Grupo', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private modificar(): void {
    this.guardarLoading = true;
    this.grupoSrv.putGrupo(Number(this.idgrupo), this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.create('success', 'Guardado correctamente', '');
          this.idgrupo = `${this.fg.controls.id.value}`;
          this.router.navigate([this.fg.controls.id.value], {relativeTo: this.route.parent});
        },
        error: (e) => {
          console.log('Error al modificar grupo', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  cargarId(): void{
    this.lastIdLoading = true;
    this.grupoSrv.getLastId()
      .pipe(finalize(() => this.lastIdLoading = false))
      .subscribe({
        next: (id) => {
          this.fg.controls.id.setValue(id+1)                    
        },
        error: (e) => {
          console.log('Error al cargar ultimpo id de grupos', e);
          this.httpErrorHandler.process(e);
        }
    });
  }
}
