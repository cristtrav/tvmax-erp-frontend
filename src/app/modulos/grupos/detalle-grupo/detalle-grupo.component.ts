import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Grupo } from '../../../dto/grupo-dto';
import { GruposService } from '../../../servicios/grupos.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service'

@Component({
  selector: 'app-detalle-grupos',
  templateUrl: './detalle-grupo.component.html',
  styleUrls: ['./detalle-grupo.component.scss']
})
export class DetalleGrupoComponent implements OnInit {

  idgrupo = 'nuevo';
  fg: UntypedFormGroup = this.fb.group({
    id: [null, [Validators.required]],
    descripcion: [null, [Validators.required, Validators.maxLength(80)]]
  });
  formLoading: boolean = false;
  guardarLoading: boolean = false;

  constructor(
    private aroute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private grupoSrv: GruposService,
    private notif: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('id');
    this.idgrupo = param !== null ? param : 'nuevo';
    if(this.idgrupo !== 'nuevo'){
      this.cargarDatos();
    }
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.grupoSrv.getGrupoPorId(+this.idgrupo).subscribe((data)=>{
      this.fg.get('id')?.setValue(data.id);
      this.fg.get('descripcion')?.setValue(data.descripcion);
      this.formLoading = false;
    }, (e)=>{
      console.log('Error al cargar datos de Grupo');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos de Grupo', e.error);
      this.formLoading = false;
    });
  }

  private validado(): boolean {
    let val = true;
    Object.keys(this.fg.controls).forEach((key) => {
      const ctrl = this.fg.get(key);
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

  private getDto(): Grupo {
    const gru: Grupo = new Grupo();
    gru.id = this.fg.get('id')?.value;
    gru.descripcion = this.fg.get('descripcion')?.value;
    return gru;
  }

  guardar(): void {
    if (this.validado()) {
      if(this.idgrupo === 'nuevo'){
        this.registrar();
      }else{
        this.modificar();
      }
    }
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.grupoSrv.postGrupo(this.getDto()).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.fg.reset();
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al registrar Grupo');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const g: Grupo = this.getDto();
    this.grupoSrv.putGrupo(+this.idgrupo, this.getDto()).subscribe(()=>{
      this.notif.create('success', 'Guardado correctamente', '');
      this.idgrupo = `${g.id}`;
      this.router.navigate([g.id], {relativeTo: this.route.parent});
      this.guardarLoading = false;
    }, (e: HttpErrorResponse)=>{
      console.log('Error al modificar grupo');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }
}
