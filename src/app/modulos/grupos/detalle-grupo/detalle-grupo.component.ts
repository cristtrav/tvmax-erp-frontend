import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grupo } from 'src/app/dto/grupo-dto';
import { GruposService } from '../../../servicios/grupos.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-detalle-grupos',
  templateUrl: './detalle-grupo.component.html',
  styleUrls: ['./detalle-grupo.component.scss']
})
export class DetalleGrupoComponent implements OnInit {

  idgrupo = 'nuevo';
  fg: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    descripcion: [null, [Validators.required, Validators.maxLength(80)]]
  });

  constructor(
    private aroute: ActivatedRoute,
    private fb: FormBuilder,
    private grupoSrv: GruposService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('id');
    this.idgrupo = param !== null ? param : 'nuevo';
    if(this.idgrupo !== 'nuevo'){
      this.fg.get('id')?.disable();
      this.cargarDatos();
    }
  }

  private cargarDatos(): void {
    this.grupoSrv.getGrupoPorId(+this.idgrupo).subscribe((data)=>{
      this.fg.get('id')?.setValue(data.id);
      this.fg.get('descripcion')?.setValue(data.descripcion);
    }, (e)=>{
      console.log('Error al cargar datos de Grupo');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos de Grupo', e.error);
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
    this.grupoSrv.postGrupo(this.getDto()).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.fg.reset();
    }, (e) => {
      console.log('Error al registrar Grupo');
      console.log(e);
      this.notif.create('error', 'Error al guardar', e.error);
    });
  }

  private modificar(): void {
    this.grupoSrv.putGrupo(this.getDto()).subscribe(()=>{
      this.notif.create('success', 'Guardado correctamente', '');
    }, (e)=>{
      console.log('Error al modificar grupo');
      console.log(e);
      this.notif.create('error', 'Eror al guardar', e.error);
    });
  }
}
