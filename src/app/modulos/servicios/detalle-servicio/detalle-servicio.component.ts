import { Component, OnInit } from '@angular/core';
import { GruposService } from './../../../servicios/grupos.service';
import { Grupo } from './../../../dto/grupo-dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Servicio } from './../../../dto/servicio-dto';
import { ServiciosService } from './../../../servicios/servicios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.scss']
})
export class DetalleServicioComponent implements OnInit {

  idservicio = 'nuevo';
  lstGrupos: Grupo[] = [];
  form: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    descripcion: [null, [Validators.required, Validators.maxLength(100)]],
    idgrupo: [null, [Validators.required]],
    precio: [null, [Validators.required]],
    suscribible: [false, [Validators.required]]
  });

  constructor(
    private gruposSrv: GruposService,
    private notif: NzNotificationService,
    private fb: FormBuilder,
    private serviciosSrv: ServiciosService,
    private aroute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('id');
    this.idservicio = param !== null?param:'nuevo';
    this.cargarGrupos();
    if(this.idservicio!=='nuevo'){
      this.form.get('id')?.disable();
      this.cargarServicio();
    }
  }

  private cargarServicio(){
    this.serviciosSrv.getServicioPorId(+this.idservicio).subscribe((data)=>{
      this.form.get('id')?.setValue(data.id);
      this.form.get('descripcion')?.setValue(data.descripcion);
      this.form.get('idgrupo')?.setValue(data.idgrupo);
      this.form.get('precio')?.setValue(data.precio);
      this.form.get('suscribible')?.setValue(data.suscribible);
    }, (e)=>{
      console.log('Error al cargar datos de servicio');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos del Servicio', e.error);
    });
  }

  private cargarGrupos(): void{
    this.gruposSrv.getGrupos().subscribe((data)=>{
      this.lstGrupos = data;
    }, (e)=>{
      console.log('Error al cargar grupos');
      console.log(e);
      this.notif.create('error', 'Error al cargar Grupos', e.error);
    });
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

  getDto(): Servicio {
    const srv: Servicio = new Servicio();
    srv.id = this.form.get('id')?.value;
    srv.descripcion = this.form.get('descripcion')?.value;
    srv.idgrupo = this.form.get('idgrupo')?.value;
    srv.precio = this.form.get('precio')?.value;
    srv.suscribible = this.form.get('suscribible')?.value;
    return srv;
  }

  guardar(): void {
    if(this.validado()){
      if(this.idservicio === 'nuevo'){
        this.registrar();
      }else{
        this.modificar();
      }
    }
  }

  private registrar(): void {
    this.serviciosSrv.postServicio(this.getDto()).subscribe(()=>{
      this.notif.create('success', 'Guardado correctamente','');
      this.form.reset();
    }, (e)=>{
      console.log('Error al registrar Servicio');
      console.log(e);
      this.notif.create('error', 'Error al guardar', e.error);
    })
  }

  private modificar(): void{
    this.serviciosSrv.putServicio(this.getDto()).subscribe(()=>{
      this.notif.create('success', 'Guardado correctamente', '');
    }, (e)=>{
      console.log('Error al modificar Servicio');
      console.log(e);
      this.notif.create('error', 'Error al guardar', e.error);
    });
  }

}
