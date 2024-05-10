import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { UsuarioDTO } from '@dto/usuario.dto';
import { DetalleReclamoDTO } from 'src/app/global/dtos/reclamos/detalle-reclamo.dto';
import { MotivoReclamoDTO } from 'src/app/global/dtos/reclamos/motivo-reclamo.dto';
import { ReclamoDTO } from 'src/app/global/dtos/reclamos/reclamo.dto';
import { ReclamosService } from 'src/app/global/services/reclamos/reclamos.service';
import { ResponsiveSizes } from 'src/app/global/utils/responsive/responsive-sizes.interface';
import { ClientesService } from '@servicios/clientes.service';
import { UsuariosService } from '@servicios/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription, finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-detalle-reclamo',
  templateUrl: './detalle-reclamo.component.html',
  styleUrls: ['./detalle-reclamo.component.scss']
})
export class DetalleReclamoComponent implements OnInit, OnDestroy {

  detalleSizes: ResponsiveSizes = { nzXs: 24, nzSm: 24, nzMd: 13, nzLg: 14, nzXl: 14, nzXXl: 14 };
  cabeceraSizes: ResponsiveSizes = { nzXs: 24, nzSm: 24, nzMd: 11, nzLg: 10, nzXl: 10, nzXXl: 10 };
  formCabeceraLabelSizes: ResponsiveSizes = { nzXs: 24, nzSm: 24, nzMd: 24, nzLg: 7, nzXl: 7, nzXXl: 7 };
  formCabeceraControlSizes: ResponsiveSizes = { nzXs: 24, nzSm: 24, nzMd: 24, nzLg: 15, nzXl: 15, nzXXl: 15 };
  formCabeceraAccionesSizes: ResponsiveSizes = { nzXs: 24, nzSm: 24, nzMd: 24, nzLg: 22, nzXl: 22, nzXXl: 22 };
  
  idreclamo: string = 'nuevo';

  formCabecera: FormGroup = new FormGroup({
    fecha: new FormControl(new Date, [Validators.required]),    
    idcliente: new FormControl(null, [Validators.required]),
    idsuscripcion: new FormControl(null, [Validators.required]),
    idusuarioresponsable: new FormControl<number | null>(null),
    estado: new FormControl<string | null>(null),
    observacionestado: new FormControl<string | null>(null),
    fechahoracambioestado: new FormControl<Date | null>(null),
    observacion: new FormControl<string | null>(null, [Validators.maxLength(100)])
  });

  lstClientes: Cliente[] = [];  
  loadingClientes: boolean = false;

  textoBusqueda: string = '';
  timerBusqueda: any;

  idclienteSuscription!: Subscription;
  estadoSuscription!: Subscription;

  lstSuscripciones: Suscripcion[] = [];
  loadingSuscripciones: boolean = false;

  lstResponsables: UsuarioDTO[] = [];
  loadingResponsables: boolean = false;

  lstDetallesReclamos: DetalleReclamoDTO[] = [];
  guardando: boolean = false;
  validandoForm: boolean = false;

  alertaDetallesVisible: boolean = false;

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private clientesSrv: ClientesService,
    private usuariosSrv: UsuariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private modal: NzModalService,
    private reclamosSrv: ReclamosService
  ){}

  ngOnDestroy(): void {
    this.idclienteSuscription.unsubscribe();
    this.estadoSuscription.unsubscribe();
  }

  ngOnInit(): void {
    const idreclamoStr = this.aroute.snapshot.paramMap.get('idreclamo');
    this.idreclamo = Number.isInteger(Number(idreclamoStr)) ? `${idreclamoStr}` : 'nuevo';
    if(this.idreclamo != 'nuevo'){
      this.cargarDatos(Number(this.idreclamo));
      this.formCabecera.controls.estado.addValidators(Validators.required);
    }else this.formCabecera.controls.estado.removeValidators(Validators.required);

    this.estadoSuscription = this.formCabecera.controls.estado.valueChanges.subscribe(val => {
      if(val == 'OTR' && this.idreclamo != 'nuevo') {
        this.formCabecera.controls.observacionestado.addValidators(Validators.required);
      }
      else {
        this.formCabecera.controls.observacionestado.removeValidators(Validators.required);
        this.formCabecera.controls.observacionestado.reset();
      }
    });
    
    this.cargarClientes();
    this.cargarResponsables();
    
    this.idclienteSuscription = this.formCabecera.controls.idcliente.valueChanges.subscribe(value => {
      if(this.validandoForm) return;

      this.formCabecera.controls.idcliente.value
      this.formCabecera.controls.idsuscripcion.reset();
      if (value == null) this.lstSuscripciones = []
      else this.cargarSuscripciones(value);
    });
  }

  cargarDatos(idreclamo: number){
    const paramsDetalles = new HttpParams().append('eliminado', false);
    forkJoin({
      reclamo: this.reclamosSrv.getPorId(idreclamo),
      detalles: this.reclamosSrv.getDetallesByReclamo(idreclamo, paramsDetalles)
    })
    .subscribe(resp => {
      console.log(resp.reclamo)
      this.formCabecera.controls.fecha.setValue(resp.reclamo.fecha);
      this.formCabecera.controls.estado.setValue(resp.reclamo.estado);
      this.formCabecera.controls.idcliente.setValue(resp.reclamo.idcliente);
      this.formCabecera.controls.idsuscripcion.setValue(resp.reclamo.idsuscripcion);
      this.formCabecera.controls.estado.setValue(resp.reclamo.estado);
      this.formCabecera.controls.observacionestado.setValue(resp.reclamo.observacionestado);
      this.formCabecera.controls.idusuarioresponsable.setValue(resp.reclamo.idusuarioresponsable);
      this.formCabecera.controls.observacion.setValue(resp.reclamo.observacion);
      if(!this.lstClientes.find(cli => cli.id == resp.reclamo.idcliente)) this.agregarClienteLista(resp.reclamo.idcliente ?? -1);
      this.lstDetallesReclamos = resp.detalles;
    });
  }

  agregarClienteLista(idcliente: number){
    this.clientesSrv
      .getPorId(idcliente)
      .subscribe((cliente) => this.lstClientes = this.lstClientes.concat([cliente]));
  }

  cargarResponsables(){
    const params = new HttpParams()
    .append('eliminado', false)
    .append('sort', '+razonsocial')
    .append('idrol', 9);
    this.loadingResponsables = true;
    this.usuariosSrv
      .get(params)
      .pipe(finalize(() => this.loadingResponsables = false))
      .subscribe({
        next: (usuarios) => this.lstResponsables = usuarios,
        error: (e) => {
          console.error('Error al cargar responsables', e);
          this.httpErrorHandler.process(e);
        }
    })
  }

  cargarSuscripciones(idcliente: number){
    this.loadingSuscripciones = true;
    this.clientesSrv
      .getSuscripcionesPorCliente(idcliente, this.getHttpParamsSuscripciones())
      .pipe(finalize(() => this.loadingSuscripciones = false))
      .subscribe({
        next: (suscripciones) => {
          this.lstSuscripciones = suscripciones;
        },
        error: (e) => {
          console.error('Error al cargar suscripciones por cliente', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  cargarClientes(){
    this.loadingClientes = true;
    this.clientesSrv.get(this.getHttpParamsClientes())
    .pipe(finalize(() => this.loadingClientes = false))
    .subscribe({
      next: (clientes) => {
        this.lstClientes = clientes;
      },
      error: (e) => {
        console.error('Error al cargar clientes', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  buscarCliente(busqueda: string){
    if(busqueda == this.textoBusqueda) return;

    clearTimeout(this.timerBusqueda);
    this.textoBusqueda = busqueda;
    this.timerBusqueda = setTimeout(() => {
      this.lstClientes = [];      
      this.cargarClientes();
    }, 250);
  }

  getHttpParamsClientes(): HttpParams {
    let params =
      new HttpParams()
      .append('eliminado', false)
      .append('limit', this.lstClientes.length + 10)
      .append('sort', '+razonsocial');
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

  getHttpParamsSuscripciones(): HttpParams {
    let params =
      new HttpParams()
      .append('eliminado', false);
    return params;
  }

  agregarDetalle(motivo: MotivoReclamoDTO){
    this.alertaDetallesVisible = false;
    if(this.lstDetallesReclamos.find(d => d.idmotivo == motivo.id)){
      this.notif.warning('<strong>Ya existe</strong>', `El motivo «${motivo.descripcion}» ya fue agregado.`);
      return;
    }
    this.lstDetallesReclamos = this.lstDetallesReclamos.concat([
      {
        id: this.lstDetallesReclamos.length,
        idmotivo: motivo.id,
        motivo: motivo.descripcion,
        eliminado: false
      }
    ])
  }

  confirmarEliminacion(detalle: DetalleReclamoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el motivo de reclamo?',
      nzContent: `${detalle.motivo}${ detalle.observacion ? ' ('+detalle.observacion+')': ''}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminarDetalle(detalle.id)
    })
  }

  eliminarDetalle(id: number){
    this.lstDetallesReclamos = this.lstDetallesReclamos.filter(detalle => detalle.id != id);
    this.alertaDetallesVisible = this.lstDetallesReclamos.length == 0;
  }

  guardar(){
    if(this.esValido()){
      if(this.idreclamo == 'nuevo') this.registrar();
      else this.editar();
    }
  }

  esValido(): boolean{
    this.validandoForm = true;
    Object.keys(this.formCabecera.controls).forEach(key => {
      this.formCabecera.get(key)?.markAsDirty();
      this.formCabecera.get(key)?.updateValueAndValidity();
    });
    this.validandoForm = false;
    this.alertaDetallesVisible = this.lstDetallesReclamos.length == 0
    return this.formCabecera.valid && this.lstDetallesReclamos.length > 0; 
  }

  limpiar(){
    this.formCabecera.reset();
    this.lstDetallesReclamos = [];
    this.alertaDetallesVisible = false;
    this.formCabecera.controls.fecha.setValue(new Date());
    this.idreclamo = 'nuevo';
    this.router.navigate(['nuevo'], { relativeTo: this.aroute.parent });
  }

  private registrar(){
    this.guardando = true
    this.reclamosSrv
      .post(this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe((idreclamo) => {
        this.idreclamo = `${idreclamo}`;
        this.router.navigate([idreclamo], { relativeTo: this.aroute.parent });
        this.notif.success('<strong>Éxito</strong>', 'Reclamo registrado.');
        this.formCabecera.controls.estado.setValue('PEN');
      });
  }

  private editar(){
    this.reclamosSrv
      .put(Number(this.idreclamo), this.getDto())
      .subscribe(() => this.notif.success('<strong>Éxito</strong>', 'Reclamo editado.'));
  }

  getDto(): ReclamoDTO{
    return {
      id: this.idreclamo != 'nuevo' ? Number(this.idreclamo) : undefined,
      fecha: this.formCabecera.controls.fecha.value,
      idsuscripcion: this.formCabecera.controls.idsuscripcion.value,
      estado: this.formCabecera.controls.estado.value ?? 'PEN',
      idusuarioresponsable: this.formCabecera.controls.idusuarioresponsable.value,
      detalles: this.lstDetallesReclamos,
      observacionestado: this.formCabecera.controls.observacionestado.value,
      observacion: this.formCabecera.controls.observacion.value,
      eliminado: false
    }
  }

}
