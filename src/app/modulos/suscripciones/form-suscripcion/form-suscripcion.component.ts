import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomiciliosService } from './../../../servicios/domicilios.service';
import { Domicilio } from './../../../dto/domicilio-dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Servicio } from './../../../dto/servicio-dto';
import { ServiciosService } from './../../../servicios/servicios.service';
import { SuscripcionesService } from './../../../servicios/suscripciones.service';
import { Suscripcion } from 'src/app/dto/suscripcion-dto';
import { Extra } from './../../../util/extra';

@Component({
  selector: 'app-form-suscripcion',
  templateUrl: './form-suscripcion.component.html',
  styleUrls: ['./form-suscripcion.component.scss']
})
export class FormSuscripcionComponent implements OnInit {

  @Input()
  idsuscripcion = 'nueva';

  @Input()
  idcliente: number | null = null;

  form: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    iddomicilio: [null, [Validators.required]],
    idservicio: [null, [Validators.required]],
    monto: [null, [Validators.required]],
    estado: [null, Validators.required],
    fechasuscripcion: [null, [Validators.required]],
    fechacambioestado: [null, [Validators.required]]
  });

  lstDomicilios: Domicilio[] = [];
  lstServicios: Servicio[] = [];
  guardarLoading = false;
  labelFechaCambio = '';

  constructor(
    private fb: FormBuilder,
    private domiSrv: DomiciliosService,
    private notif: NzNotificationService,
    private serviciosSrv: ServiciosService,
    private suscSrv: SuscripcionesService
  ) { }

  ngOnInit(): void {
    this.cargarDomicilios();
    this.cargarServicios();
    if (this.idsuscripcion !== 'nueva') {
      this.cargarDatos();
    } else {
      this.cargarUltimoId();
    }

  }

  private cargarDatos(): void {
    this.suscSrv.getPorId(+this.idsuscripcion).subscribe((data) => {
      this.form.get('id')?.setValue(data.id);
      this.form.get('iddomicilio')?.setValue(data.iddomicilio);
      this.form.get('idservicio')?.setValue(data.idservicio);
      this.form.get('monto')?.setValue(data.monto);
      this.form.get('estado')?.setValue(data.estado);
      if (data.fechasuscripcion) {
        this.form.get('fechasuscripcion')?.setValue(new Date(`${data.fechasuscripcion}T00:00:00`));
      }
      if (data.fechacambioestado) {
        this.form.get('fechacambioestado')?.setValue(new Date(`${data.fechacambioestado}T00:00:00`));
      }
    }, (e) => {
      console.log('Error al cargar datos de la suscripcion');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos de suscripción', e.error);
    });
  }

  private cargarDomicilios(): void {
    this.domiSrv.get([{ key: 'idcliente', value: this.idcliente }]).subscribe((data) => {
      this.lstDomicilios = data;
    }, (e) => {
      console.log('Error al cargar domicilios del cliente');
      console.log(e);
      this.notif.create('error', 'Error al cargar domicilios del cliente', e.error);
    });
  }

  private cargarServicios(): void {
    const param = [{ key: 'suscribible', value: true }]
    this.serviciosSrv.getServicios(param).subscribe((data) => {
      this.lstServicios = data;
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

  guardar() {
    if (this.validado()) {
      if (this.idsuscripcion === 'nueva') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
  }

  private getDto(): Suscripcion {
    const s: Suscripcion = new Suscripcion();
    s.id = this.form.get('id')?.value;
    s.monto = this.form.get('monto')?.value;
    s.idservicio = this.form.get('idservicio')?.value;
    s.iddomicilio = this.form.get('iddomicilio')?.value;
    s.idcliente = this.idcliente;
    s.estado = this.form.get('estado')?.value;
    const fs: Date = this.form.get('fechasuscripcion')?.value;
    if (fs) {
      s.fechasuscripcion = Extra.dateToString(fs);
    }
    const fce: Date = this.form.get('fechacambioestado')?.value;
    if (fce) {
      s.fechacambioestado = Extra.dateToString(fce);
    }
    return s;
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.suscSrv.post(this.getDto()).subscribe(() => {
      this.notif.create('success', 'Suscripción guardada correctamente', '');
      this.form.reset();
      this.form.get('conectado')?.setValue(true);
      this.form.get('reconectado')?.setValue(false);
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al registrar suscripcion');
      console.log(e);
      this.notif.create('error', 'Error al guardar suscripción', e.error);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const sus = this.getDto();
    this.suscSrv.put(+this.idsuscripcion, sus).subscribe(() => {
      this.notif.create('success', 'Suscripción guardada correctamente', '');
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar suscripcion');
      console.log(e);
      this.notif.create('error', 'Error al guardar suscripción', e.error);
      this.guardarLoading = false;
    });
  }

  onChangeServicio(idsrv: any): void {
    if (idsrv) {
      for (let s of this.lstServicios) {
        if (s.id === +idsrv) {
          this.form.get('monto')?.setValue(s.precio);
          break;
        }
      }
    }
  }

  cargarUltimoId(): void {
    this.suscSrv.getUltimoId().subscribe((data) => {
        this.form.get('id')?.setValue(data.ultimoid?data.ultimoid+1:1);
    }, (e) => {
      console.log('Error al consultar el ultimo código de suscripción');
      console.log(e);
      this.notif.create('error', 'Error al consultar código de suscripción', e.error);
    });
  }

  seleccionEstado(e: string | null): void {
    this.form.get('fechacambioestado')?.reset();
    switch (e) {
      case 'C':
        this.labelFechaCambio = 'conexión';
        break;
      case 'R':
        this.labelFechaCambio = 'reconexion';
        break;
      case 'D':
        this.labelFechaCambio = 'desconexión';
        break;
      default:
        this.labelFechaCambio = '';
        break;
    }
  }

}
