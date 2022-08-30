import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiciosService } from './../../../servicios/servicios.service';
import { Servicio } from './../../../dto/servicio-dto';
import { Cuota } from 'src/app/dto/cuota-dto';
import { CuotasService } from './../../../servicios/cuotas.service';
import { Extra } from './../../../util/extra';
import { HttpParams } from '@angular/common/http';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { HttpErrorResponseHandlerService } from './../../../util/http-error-response-handler.service';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { Suscripcion } from '@dto/suscripcion-dto';

@Component({
  selector: 'app-form-cuota',
  templateUrl: './form-cuota.component.html',
  styleUrls: ['./form-cuota.component.scss']
})
export class FormCuotaComponent implements OnInit {

  opcionesServicios: {value: number, label: string, children: {value: number, label: string, isLeaf: boolean}[]}[] = [];

  form: UntypedFormGroup = this.fb.group({
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
  suscripcionActual: Suscripcion | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private cuotaSrv: CuotasService,
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarGruposServicios();
    if (this.idcuota) {
      if (this.idcuota !== 'nueva') {
        this.cargarDatos();
      }
    }
    this.form.get('idservicio')?.valueChanges.subscribe((v)=>{
      const id: number | null = v ? v[1] : null;
      this.seleccionServicio(id);
    });
  }

  private async cargarGruposServicios() {
    let param: HttpParams = new HttpParams().append('sort', '+descripcion');
    param = param.append('eliminado', 'false');
    const op: {value: number, label: string, children: {value: number, label: string, isLeaf: boolean}[]}[] = [];
    try {
      const susc: Suscripcion = await this.suscripcionesSrv.getPorId(Number(this.idsuscripcion)).toPromise();
      const respSrv: ServerResponseList<Servicio> = await this.serviciosSrv.getServicios(param).toPromise();
      for(let srv of respSrv.data){
        if(srv.id == susc.idservicio || !srv.suscribible){
          let existeg = false;
          for(let o of op){
            if(o.value === srv.idgrupo){
              existeg = true;
              o.children.push(
                {
                  value: Number(srv.id),
                  label: `${srv.descripcion}`,
                  isLeaf: true
                }
              );
              break;
            }
          }
          if(!existeg){
            op.push(
              {
                value: Number(srv.idgrupo),
                label:`${srv.grupo}`,
                children: [
                  {
                    value: Number(srv.id),
                    label: `${srv.descripcion}`,
                    isLeaf: true
                  }
                ]
              }
            );
          }
        }
      }
      this.opcionesServicios = op;
    } catch (e) {
      console.log('Error al cargar servicios');
      console.log(e);
      this.httpErrorHandler.handle(e);
    }
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
    c.idservicio = this.form.get('idservicio')?.value[1];
    c.monto = this.form.get('monto')?.value;
    c.nrocuota = this.form.get('nrocuota')?.value;
    const obs = this.form.get('observacion')?.value;
    if (obs) {
      c.observacion = obs === '' ? null : obs;
    }
    const fv = this.form.get('fechavencimiento')?.value;
    if (fv) {
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

  private seleccionServicio(idservicio: number | null) {
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
    this.cuotaSrv.put(+this.idcuota, c).subscribe(() => {
      this.notif.create('success', 'Cuota guardada correctamente', '');
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar cuota');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private async cargarDatos() {
    this.formLoading = true;
    try{
      const data: Cuota = await this.cuotaSrv.getPorId(+this.idcuota).toPromise();
      const serv: Servicio = await this.serviciosSrv.getServicioPorId(Number(data.idservicio)).toPromise();
      this.form.get('idservicio')?.setValue([serv.idgrupo, serv.id]);
      this.form.get('fechavencimiento')?.setValue(new Date(`${data.fechavencimiento}T00:00:00`));
      this.form.get('monto')?.setValue(data.monto);
      this.form.get('nrocuota')?.setValue(data.nrocuota);
      this.form.get('observacion')?.setValue(data.observacion);
      this.formLoading = false;
    }catch(e){
      console.log('Error al cargar datos de la cuota');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.formLoading = false;
    }
  }
}
