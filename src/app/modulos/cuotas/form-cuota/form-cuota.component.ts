import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiciosService } from './../../../servicios/servicios.service';
import { Servicio } from './../../../dto/servicio-dto';
import { Cuota } from 'src/app/dto/cuota-dto';
import { CuotasService } from './../../../servicios/cuotas.service';
import { Extra } from './../../../util/extra';
import { HttpParams } from '@angular/common/http';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { HttpErrorResponseHandlerService } from './../../../util/http-error-response-handler.service';

@Component({
  selector: 'app-form-cuota',
  templateUrl: './form-cuota.component.html',
  styleUrls: ['./form-cuota.component.scss']
})
export class FormCuotaComponent implements OnInit {

  form: FormGroup = this.fb.group({
    idservicio: [null, [Validators.required]],
    fechavencimiento: [null, [Validators.required]],
    monto: [null, [Validators.required]],
    nrocuota: [null],
    observacion: [null, [Validators.maxLength(150)]]
  });

  guardarLoading: boolean = false;
  formLoading: boolean = false;
  @Input()
  idsuscripcion: number | null = null;
  @Input()
  idcuota = 'nueva';
  lstServicios: Servicio[] = [];

  constructor(
    private fb: FormBuilder,
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private cuotaSrv: CuotasService,
    private httpErrorHandler : HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
    if(this.idcuota){
      if(this.idcuota!=='nueva'){
        this.cargarDatos();
      }
    }
  }

  private cargarServicios() {
    const param: HttpParams = new HttpParams().append('sort', '+descripcion');
    this.serviciosSrv.getServicios(param).subscribe((resp: ServerResponseList<Servicio>) => {
      this.lstServicios = resp.data;
    }, (e) => {
      console.log('Error al cargar servicios');
      console.log(e);
      this.notif.create('error', 'Error al cargar servicios', e.error);
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

  private getDto(): Cuota {
    const c: Cuota = new Cuota();
    if (this.idcuota !== 'nueva') {
      c.id = +this.idcuota;
    }
    c.idservicio = this.form.get('idservicio')?.value;
    c.monto = this.form.get('monto')?.value;
    c.nrocuota = this.form.get('nrocuota')?.value;
    const obs = this.form.get('observacion')?.value;
    if(obs){
      c.observacion = obs === ''? null : obs;
    }
    const fv = this.form.get('fechavencimiento')?.value;
    if(fv){
      c.fechavencimiento = Extra.dateToString(fv);
    }
    c.idsuscripcion = this.idsuscripcion;
    return c;
  }

  guardar(): void {
    if (this.validado()) {
      if (this.idcuota === 'nueva') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
    this.validado();
  }

  seleccionServicio(idservicio: number | null) {
    if (idservicio) {
      for (let s of this.lstServicios) {
        if (s.id === idservicio) {
          this.form.get('monto')?.setValue(s.precio);
          break;
        }
      }
    } else {
      this.form.get('monto')?.reset();
    }
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.cuotaSrv.post(this.getDto()).subscribe(() => {
      this.notif.create('success', 'Cuota guardada correctamente', '');
      this.form.reset();
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al registrar cuota');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const c: Cuota = this.getDto();
    this.cuotaSrv.put(+this.idcuota, c).subscribe(()=>{
      this.notif.create('success', 'Cuota guardada correctamente', '');
      this.guardarLoading = false;
    }, (e)=>{
      console.log('Error al modificar cuota');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }
  
  private cargarDatos(): void{
    this.formLoading = true;
    this.cuotaSrv.getPorId(+this.idcuota).subscribe((data)=>{
      this.form.get('idservicio')?.setValue(data.idservicio);
      this.form.get('fechavencimiento')?.setValue(new Date(`${data.fechavencimiento}T00:00:00`));
      this.form.get('monto')?.setValue(data.monto);
      this.form.get('nrocuota')?.setValue(data.nrocuota);
      this.form.get('observacion')?.setValue(data.observacion);
      this.formLoading = false;
    }, (e)=>{
      console.log('Error al cargar datos de la cuota');
      console.log(e);
      //this.notif.create('error', 'Error al cargar datos de la cuota', e.error);
      this.httpErrorHandler.handle(e);
      this.formLoading = false;
    });
  }
}
