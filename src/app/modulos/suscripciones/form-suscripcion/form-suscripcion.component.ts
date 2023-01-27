import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DomiciliosService } from './../../../servicios/domicilios.service';
import { Domicilio } from './../../../dto/domicilio-dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Servicio } from './../../../dto/servicio-dto';
import { ServiciosService } from './../../../servicios/servicios.service';
import { SuscripcionesService } from './../../../servicios/suscripciones.service';
import { Suscripcion } from 'src/app/dto/suscripcion-dto';
import { Extra } from './../../../util/extra';
import { Cliente } from './../../../dto/cliente-dto';
import { ClientesService } from './../../../servicios/clientes.service';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
import { HttpParams } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-suscripcion',
  templateUrl: './form-suscripcion.component.html',
  styleUrls: ['./form-suscripcion.component.scss']
})
export class FormSuscripcionComponent implements OnInit {

  @Input()
  navigateOnSaveDest: string | null = null;
  @Input()
  idsuscripcion = 'nueva';
  @Output()
  idsuscripcionChange = new EventEmitter<string>();

  @Input()
  idcliente: number | null = null;

  @Input()
  mostrarCliente: boolean = false;

  form: UntypedFormGroup = this.fb.group({
    id: [null, [Validators.required]],
    iddomicilio: [null, [Validators.required]],
    idservicio: [null, [Validators.required]],
    monto: [null, [Validators.required]],
    estado: [null, Validators.required],
    fechasuscripcion: [null, [Validators.required]],
    fechacambioestado: [null, [Validators.required]],
    idcliente: [null, [Validators.required]]
  });

  lstClientes: Cliente[] = [];
  lstDomicilios: Domicilio[] = [];
  lstServicios: Servicio[] = [];
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  labelFechaCambio = '';
  idLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private domiSrv: DomiciliosService,
    private notif: NzNotificationService,
    private serviciosSrv: ServiciosService,
    private suscSrv: SuscripcionesService,
    private clientesSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private router: Router,
    private aroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.idcliente) {
      this.form.get('idcliente')?.setValue(`${this.idcliente}`);
      this.cargarDomicilios();
    }
    this.cargarServicios();
    if (this.idsuscripcion !== 'nueva') {
      this.cargarDatos();
    } /*else {
      this.cargarUltimoId();
    }*/
    this.cargarClientes();
  }

  private cargarDatos(): void {
    this.formLoading = true;
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
      this.form.get('idcliente')?.setValue(data.idcliente);
      this.formLoading = false;
    }, (e) => {
      console.log('Error al cargar datos de la suscripcion');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos de suscripción', e.error);
      this.formLoading = false;
    });
  }

  private cargarDomicilios(): void {
    const idcli = this.form.get('idcliente')?.value;
    var par: HttpParams = new HttpParams().append('idcliente', `${idcli}`);
    par = par.append('eliminado', 'false');
    this.domiSrv.get(par).subscribe((resp: ServerResponseList<Domicilio>) => {
      this.lstDomicilios = resp.data;
    }, (e) => {
      console.log('Error al cargar domicilios del cliente');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  private cargarServicios(): void {
    const param = new HttpParams().append('suscribible', 'true');
    this.serviciosSrv.getServicios(param).subscribe({
      next: (servicios) => {
        this.lstServicios = servicios;
      },
      error: (e) => {
        console.error('Error al cargar servicios', e);
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
    s.idcliente = this.form.get('idcliente')?.value;
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
      this.idsuscripcion = `${sus.id}`;
      this.idsuscripcionChange.emit(this.idsuscripcion);
      this.router.navigate([sus.id], { relativeTo: this.aroute.parent });
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
    this.idLoading = true;
    this.suscSrv.getUltimoId().subscribe((data) => {
      this.form.get('id')?.setValue(data ? +data + 1 : 1);
      this.idLoading = false;
    }, (e) => {
      console.log('Error al consultar el ultimo código de suscripción');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.idLoading = false;
      //this.notif.create('error', 'Error al consultar código de suscripción', e.error);
    });
  }

  cargarClientes(): void {
    this.clientesSrv.get(this.getHttpQueryParamsCliente()).subscribe({
      next: (clientes) => {
        this.lstClientes = clientes;
      },
      error: (e) => {
        console.error('Error al cargar clientes',e);
        this.httpErrorHandler.process(e);
      }
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

  onChangeCliente(e: any | null): void {
    this.idcliente = e;
    if (e) {
      this.cargarDomicilios();
    } else {
      this.lstDomicilios = [];
      this.form.get('iddomicilio')?.reset();
    }
  }

  getHttpQueryParamsCliente(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    params = params.append('sort', '+razonsocial');
    return params;
  }
}
