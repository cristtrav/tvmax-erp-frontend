import { Component, OnInit } from '@angular/core';
import { GruposService } from './../../../servicios/grupos.service';
import { Grupo } from './../../../dto/grupo-dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Servicio } from './../../../dto/servicio-dto';
import { ServiciosService } from './../../../servicios/servicios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { HttpParams } from '@angular/common/http';
import { ServerResponseList } from '../../../dto/server-response-list.dto';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.scss']
})
export class DetalleServicioComponent implements OnInit {

  idservicio = 'nuevo';
  lstGrupos: Grupo[] = [];
  form: UntypedFormGroup = this.fb.group({
    id: [null, [Validators.required]],
    descripcion: [null, [Validators.required, Validators.maxLength(100)]],
    idgrupo: [null, [Validators.required]],
    precio: [null, [Validators.required]],
    suscribible: [false, [Validators.required]]
  });
  formLoading: boolean = false;
  guardarLoading: boolean = false;
  lastIdLoading: boolean = false;

  constructor(
    private gruposSrv: GruposService,
    private notif: NzNotificationService,
    private fb: UntypedFormBuilder,
    private serviciosSrv: ServiciosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService
    ) { }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('id');
    this.idservicio = param !== null?param:'nuevo';
    this.cargarGrupos();
    if(this.idservicio!=='nuevo'){
      this.cargarServicio();
    }
  }

  private cargarServicio(){
    this.formLoading = true;
    this.serviciosSrv.getServicioPorId(+this.idservicio).subscribe((data)=>{
      this.form.get('id')?.setValue(data.id);
      this.form.get('descripcion')?.setValue(data.descripcion);
      this.form.get('idgrupo')?.setValue(data.idgrupo);
      this.form.get('precio')?.setValue(data.precio);
      this.form.get('suscribible')?.setValue(data.suscribible);
      this.formLoading = false;
    }, (e)=>{
      console.log('Error al cargar datos de servicio');
      console.log(e);
      this.httpErrorHandler.handle(e)
      this.formLoading = false;
    });
  }

  private cargarGrupos(): void{
    this.gruposSrv.getGrupos(this.getQueryParamsGrupos()).subscribe({
      next: (grupos) => {
        this.lstGrupos = grupos;
      },
      error: (e) => {
        console.error('Error al cargar grupos', e);
        this.httpErrorHandler.process(e);
      }
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
    this.guardarLoading = true;
    this.serviciosSrv.postServicio(this.getDto()).subscribe(()=>{
      this.notif.create('success', 'Guardado correctamente','');
      this.form.reset();
      this.guardarLoading = false;
    }, (e)=>{
      console.log('Error al registrar Servicio');
      console.log(e);
      this.httpErrorHandler.handle(e)
      ;this.guardarLoading = false;
    })
  }

  private modificar(): void{
    ;this.guardarLoading = true;
    const s: Servicio = this.getDto();
    this.serviciosSrv.putServicio(+this.idservicio, s).subscribe(()=>{
      this.notif.create('success', 'Guardado correctamente', '');
      this.idservicio = `${s.id}`;
      this.router.navigate([s.id], {relativeTo: this.aroute.parent});
      ;this.guardarLoading = false;
    }, (e)=>{
      console.log('Error al modificar Servicio');
      console.log(e);
      this.httpErrorHandler.handle(e)
      ;this.guardarLoading = false;
    });
  }

  getQueryParamsGrupos(): HttpParams{
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    return params;
  }

  cargarId(): void{
    this.lastIdLoading = true;
    this.serviciosSrv.getLastId().subscribe({
      next: (id) => {
        this.form.get('id')?.setValue(id+1);
        this.lastIdLoading = false;
      },
      error: (e) => {
        console.log('Error al consultar ultimo ID de servicios');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.lastIdLoading = false;
      }
    });
  }

}

