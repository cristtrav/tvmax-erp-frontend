import { formatDate } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, OnInit, Input, Output, Inject, LOCALE_ID, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Cliente } from "@dto/cliente-dto";
import { Domicilio } from "@dto/domicilio-dto";
import { Servicio } from "@dto/servicio-dto";
import { Suscripcion } from "@dto/suscripcion-dto";
import { ClientesService } from "@servicios/clientes.service";
import { DomiciliosService } from "@servicios/domicilios.service";
import { ServiciosService } from "@servicios/servicios.service";
import { SuscripcionesService } from "@servicios/suscripciones.service";
import { HttpErrorResponseHandlerService } from "@util/http-error-response-handler.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { finalize } from "rxjs";


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
    idcliente: new FormControl(null, [Validators.required]),
    gentileza: new FormControl(false, [Validators.required]),
    observacion: new FormControl(null, [Validators.maxLength(100)]),
  });

  lstClientes: Cliente[] = [];

  lstDomicilios: Domicilio[] = [];
  lstServicios: Servicio[] = [];
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  labelFechaCambio = '';
  idLoading: boolean = false;
  clienteLoading: boolean = false;
  textoBusquedaCliente: string = '';
  timerBusqueda: any;

  constructor(
    private domiSrv: DomiciliosService,
    private notif: NzNotificationService,
    private serviciosSrv: ServiciosService,
    private suscSrv: SuscripcionesService,
    private clientesSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private router: Router,
    private aroute: ActivatedRoute,
    @Inject(LOCALE_ID)
    private locale: string
  ) { }

  ngOnInit(): void {
    if (this.idcliente) {
      this.form.get('idcliente')?.setValue(`${this.idcliente}`);
      this.cargarDomicilios();
    }
    this.cargarServicios();
    if (this.idsuscripcion !== 'nueva') {
      this.cargarDatos();
    }
    this.form.controls.idcliente.valueChanges.subscribe((value) => {
      this.onChangeCliente(value);
    });
    this.form.controls.idservicio.valueChanges.subscribe(value => {
      this.onChangeServicio(value);
    });
    this.form.controls.gentileza.valueChanges.subscribe(value => {
      if (value) this.form.controls.monto.setValue(0);
    })
  }

  private cargarClienteActual(idcliente: number) {
    this.clientesSrv.getPorId(idcliente).subscribe({
      next: (cliente) => {
        this.lstClientes.unshift(cliente);
      },
      error: (e) => {
        console.error('Error al cargar cliente por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.suscSrv.getPorId(Number(this.idsuscripcion)).subscribe({
      next: (suscripcion) => {
        console.log(suscripcion);
        this.formLoading = false;
        this.form.get('id')?.setValue(suscripcion.id);
        this.form.get('iddomicilio')?.setValue(suscripcion.iddomicilio);
        this.form.get('idservicio')?.setValue(suscripcion.idservicio);
        this.form.get('monto')?.setValue(suscripcion.monto);
        this.form.get('estado')?.setValue(suscripcion.estado);
        if (suscripcion.fechasuscripcion) this.form.get('fechasuscripcion')?.setValue(new Date(`${suscripcion.fechasuscripcion}`));
        if (suscripcion.fechacambioestado) this.form.get('fechacambioestado')?.setValue(new Date(`${suscripcion.fechacambioestado}`));
        this.form.get('idcliente')?.setValue(suscripcion.idcliente);
        if (suscripcion.idcliente) this.cargarClienteActual(suscripcion.idcliente);
        this.form.get('gentileza')?.setValue(suscripcion.gentileza);
        this.form.get('observacion')?.setValue(suscripcion.observacion);
      },
      error: (e) => {
        this.formLoading = false;
        console.error('Error al cargar suscripcion', e);
        this.httpErrorHandler.process(e);
      }
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
    //if (fs) s.fechasuscripcion = Extra.dateToString(fs);
    if (fs) s.fechasuscripcion = formatDate(fs, 'yyyy-MM-dd', this.locale);

    const fce: Date = this.form.get('fechacambioestado')?.value;
    if (fce) s.fechacambioestado = formatDate(fce, 'yyyy-MM-dd', this.locale);
    //if (fce) s.fechacambioestado = Extra.dateToString(fce)

    s.gentileza = this.form.get('gentileza')?.value;
    s.observacion = this.form.get('observacion')?.value;
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
        this.router.navigate(['../', sus.id], { relativeTo: this.aroute });
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al editar Suscripcion', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  onChangeServicio(idservicio: number): void {
    const servicio = this.lstServicios.find(servicio => servicio.id == idservicio);
    if (servicio) this.form.controls.monto.setValue(servicio.precio);
  }

  cargarUltimoId(): void {
    this.idLoading = true;
    this.suscSrv.getUltimoId().subscribe({
      next: (data) => {
        this.form.get('id')?.setValue(data ? +data + 1 : 1);
        this.idLoading = false;
      },
      error: (e) => {
        console.log('Error al consultar ultimo código de suscripción', e);
        this.httpErrorHandler.process(e);
        this.idLoading = false;
      }
    });
  }

  buscarClientes(search: string) {
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.lstClientes = [];
      this.textoBusquedaCliente = search;
      this.cargarClientes();
    }, 300);
  }

  cargarClientes(): void {
    this.clienteLoading = true;
    let params: HttpParams = new HttpParams()
      .append('eliminado', 'false')
      .append('sort', '+razonsocial')
      .append('offset', this.lstClientes.length)
      .append('limit', '10');
    if (this.textoBusquedaCliente) params = params.append('search', this.textoBusquedaCliente);

    this.clientesSrv.get(params)
      .pipe(
        finalize(() => this.clienteLoading = false)
      )
      .subscribe({
        next: clientes => this.lstClientes = this.lstClientes.concat(clientes),
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

  private onChangeCliente(e: any | null): void {
    this.idcliente = e;
    if (e) {
      this.cargarDomicilios();
    } else {
      this.lstDomicilios = [];
      this.form.get('iddomicilio')?.reset();
    }
  }

}
