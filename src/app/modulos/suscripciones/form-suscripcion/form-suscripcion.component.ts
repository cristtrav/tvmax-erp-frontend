import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    iddomicilio: new FormControl(null, [Validators.required]),
    idservicio: new FormControl(null, [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    estado: new FormControl(null, Validators.required),
    fechasuscripcion: new FormControl(null, [Validators.required]),
    fechacambioestado: new FormControl(null, [Validators.required]),
    idcliente: new FormControl(null, [Validators.required])
  });

  lstClientes: Cliente[] = [];
  lstDomicilios: Domicilio[] = [];
  lstServicios: Servicio[] = [];
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  labelFechaCambio = '';
  idLoading: boolean = false;

  constructor(
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
        this.form.get('fechasuscripcion')?.setValue(new Date(`${data.fechasuscripcion}`));
      }
      if (data.fechacambioestado) {
        this.form.get('fechacambioestado')?.setValue(new Date(`${data.fechacambioestado}`));
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
    var params: HttpParams = new HttpParams()
      .append('idcliente', `${this.form.controls.idcliente.value}`)
      .append('eliminado', 'false');
    this.domiSrv.get(params).subscribe({
      next: (domicilios) => {
        this.lstDomicilios = domicilios;
      },
      error: (e) => {
        console.error('Error al cargar domicilios', e);
        this.httpErrorHandler.process(e);
      }
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

  guardar() {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if (this.form.valid) {
      if (this.idsuscripcion === 'nueva') this.registrar();
      else this.modificar();
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
    this.suscSrv.post(this.getDto()).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Suscripción guardada');
        this.form.reset();
        this.form.get('conectado')?.setValue(true);
        this.form.get('reconectado')?.setValue(false);
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al registrar suscripcion', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const sus = this.getDto();
    this.suscSrv.put(Number(this.idsuscripcion), sus).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Suscripción editada.');
        this.idsuscripcion = `${sus.id}`;
        this.idsuscripcionChange.emit(this.idsuscripcion);
        this.router.navigate(['../', sus.id], {relativeTo: this.aroute});
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al editar Suscripcion', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    })
    /*this.suscSrv.put(+this.idsuscripcion, sus).subscribe(() => {
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
    });*/
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
        console.error('Error al cargar clientes', e);
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
