import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from 'src/app/util/http-error-response-handler.service';
import { Barrio } from '@dto/barrio-dto';
import { BarriosService } from '@servicios/barrios.service';
import { DomiciliosService } from '@servicios/domicilios.service';
import { Domicilio } from '@dto/domicilio-dto';
import { ClientesService } from '@servicios/clientes.service';
import { Cliente } from '@dto/cliente-dto';
import { finalize } from 'rxjs';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { LatLngTuple } from 'leaflet';
import OpenLocationCode, { CodeArea } from 'open-location-code-typescript';

const ValidateOpenLocationCode = (control: AbstractControl) => {
  if(!control.value) return null;
  if(!OpenLocationCode.isValid(control.value)) return {invalidOpenLocationCode: true};
  return null
}

@Component({
  selector: 'app-form-domicilio',
  templateUrl: './form-domicilio.component.html',
  styleUrls: ['./form-domicilio.component.scss']
})
export class FormDomicilioComponent implements OnInit {

  readonly DEFAULT_LAT_LNG: LatLngTuple = [-25.44240, -56.44198];

  @ViewChild(UbicacionComponent)
  ubicacionComp!: UbicacionComponent;

  @Input()
  iddomicilio = 'nuevo';
  @Output()
  iddomicilioChange = new EventEmitter<string>();
  @Input()
  idcliente: number | null = null;

  lstBarrios: Barrio[] = []
  lstClientes: Cliente[] = [];
  idsuscripcionNav: string | null = 'nueva';
  navigate: string | null = '';
  private textoBusqueda: string = '';
  private timerBusqueda: any;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    idcliente: new FormControl(null, [Validators.required]),
    direccion: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
    idbarrio: new FormControl(null, [Validators.required]),
    nromedidor: new FormControl(null, Validators.maxLength(30)),
    tipo: new FormControl(null, [Validators.required]),
    observacion: new FormControl(null, [Validators.maxLength(150)]),
    ubicacionOpenCode: new FormControl(null, [ValidateOpenLocationCode]),
    principal: new FormControl(false)
  });

  guardarLoading: boolean = false;
  formLoading: boolean = false;
  getLastIdLoading: boolean = false;
  clienteLoading: boolean = false;

  modalUbicacionVisible: boolean = false;
  ubicacionActual: LatLngTuple = this.DEFAULT_LAT_LNG;

  constructor(
    private barriosSrv: BarriosService,
    private notif: NzNotificationService,
    private domicilioSrv: DomiciliosService,
    private router: Router,
    private aroute: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private clientesSrv: ClientesService
  ) { }

  ngOnInit(): void {
    this.cargarBarrios();
    if (Number.isInteger(Number(this.iddomicilio))) this.cargarDatos();
    this.navigate = this.aroute.snapshot.queryParamMap.get('navigate');
    this.idsuscripcionNav = this.aroute.snapshot.queryParamMap.get('idsuscripcion');
    if(this.idcliente) {
      this.cargarClientes();
      this.form.get('idcliente')?.setValue(this.idcliente);
    }
  }

  mostrarModalUbicacion(){
    this.modalUbicacionVisible = true;
  }

  cerrarModalUbicacion(){
    this.modalUbicacionVisible = false;
  }

  aceptarUbicacion(){
    this.ubicacionActual = this.ubicacionComp.ubicacion;
    this.form.controls.ubicacionOpenCode.setValue(this.getShortCode(this.ubicacionActual[0], this.ubicacionActual[1]));
    this.cerrarModalUbicacion();
  }

  private getShortCode(lat: number, lng: number): string{
    const code = OpenLocationCode.encode(lat, lng, 11);
    return OpenLocationCode.shorten(code, Number(lat.toFixed(1)), Number(lng.toFixed(1)));
  }

  onUbicacionBlur(){
    if(this.form.controls.ubicacionOpenCode.valid && this.form.controls.ubicacionOpenCode.value){
      const code = OpenLocationCode.recoverNearest(
        this.form.controls.ubicacionOpenCode.value,
        Number(this.DEFAULT_LAT_LNG[0].toFixed(1)),
        Number(this.DEFAULT_LAT_LNG[1].toFixed(1))
      )
      const location: CodeArea = OpenLocationCode.decode(code)
      const lat = Number(location.latitudeCenter.toFixed(5));
      const lng = Number(location.longitudeCenter.toFixed(5));
      this.ubicacionActual = [lat, lng];
    }
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.domicilioSrv.getPorId(Number(this.iddomicilio))
    .pipe(finalize(() => this.formLoading = false))
    .subscribe({
      next: (domicilio) => {
        this.form.controls.id.setValue(domicilio.id);
        this.form.controls.idcliente.setValue(domicilio.idcliente);
        this.form.controls.direccion.setValue(domicilio.direccion);
        this.form.controls.idbarrio.setValue(domicilio.idbarrio);
        this.form.controls.tipo.setValue(domicilio.tipo);
        this.form.controls.nromedidor.setValue(domicilio.nromedidor);
        this.form.controls.observacion.setValue(domicilio.observacion);
        this.form.controls.principal.setValue(domicilio.principal);
        if(domicilio.latitud != null && domicilio.longitud != null){
          this.form.controls.ubicacionOpenCode.setValue(this.getShortCode(domicilio.latitud, domicilio.longitud));
          this.ubicacionActual = [domicilio.latitud, domicilio. longitud];
        }
        if(!this.lstClientes.map(c => c.id).includes(domicilio.idcliente)) 
          this.agregarCliente(Number(domicilio.idcliente));
      },
      error: (e) => {
        console.error('Error al cargar domicilio por ID', e);
        this.httpErrorHandler.process(e);        
      }
    });
  }

  buscarClientes(busqueda: string){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.lstClientes = [];
      this.textoBusqueda = busqueda;
      this.cargarClientes();
    }, 300);
    
  }

  agregarCliente(idcliente: number) {
    this.clientesSrv.getPorId(idcliente).subscribe({
      next: (cliente) => {
        this.lstClientes = [cliente, ...this.lstClientes];
      },
      error: (e) => {
        console.error('Error al cargar cliente', e);
      }
    })
  }

  cargarClientes(){
    this.clienteLoading = true;
    let httpParams = new HttpParams()
      .append('eliminado', 'false')
      .append('limit', '10')
      .append('offset', this.lstClientes.length)
      .append('sort', '+razonsocial');
    if(this.textoBusqueda) httpParams = httpParams.append('search', this.textoBusqueda);

    this.clientesSrv.get(httpParams)
    .pipe(finalize(() => this.clienteLoading = false))
    .subscribe({
      next: (clientes) => this.lstClientes = [...this.lstClientes, ...clientes],
      error: (e) => {
        console.error('Error al cargar clientes', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private cargarBarrios(): void {
    this.barriosSrv.get(this.getBarriosHttpParams()).subscribe({
      next: (barrios) => {
        this.lstBarrios = barrios;
      },
      error: (e) => {
        console.error('Error al cargar barrios', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  guardar(): void {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if (this.form.valid) {
      if (this.iddomicilio === 'nuevo') this.registrar();
      else this.modificar();
    }
  }

  private getDto(): Domicilio {
    const domi: Domicilio = new Domicilio();
    domi.id = this.form.get('id')?.value;
    domi.direccion = this.form.get('direccion')?.value;
    domi.idbarrio = this.form.get('idbarrio')?.value;
    domi.idcliente = this.form.get('idcliente')?.value;
    domi.tipo = this.form.get('tipo')?.value;
    domi.nromedidor = this.form.get('nromedidor')?.value;
    domi.observacion = this.form.get('observacion')?.value;
    domi.principal = this.form.get('principal')?.value;
    domi.latitud = this.ubicacionActual[0];
    if(this.form.controls.ubicacionOpenCode.value){
      domi.latitud = this.ubicacionActual[0];
      domi.longitud = this.ubicacionActual[1];
    }
    return domi;
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.domicilioSrv.post(this.getDto()).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Domicilio guardado');
        this.form.reset();
        this.guardarLoading = false;
        this.procesarRedireccion();
      },
      error: (e) => {
        console.error('Error al registrar Domicilio', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const domicilio = this.getDto();
    this.domicilioSrv.put(Number(this.iddomicilio), domicilio).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Domicilio editado');
        this.iddomicilio = `${domicilio.id}`;
        this.iddomicilioChange.emit(this.iddomicilio);
        this.router.navigate(['../', domicilio.id], {relativeTo: this.aroute});
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al editar Domicilio', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    })
  }

  consultarUltimoId(): void {
    this.getLastIdLoading = true;
    this.domicilioSrv.getUltimoId().subscribe({
      next: (ultimoid) => {
        this.form.controls.id.setValue(ultimoid + 1);
        this.getLastIdLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar ultimo ID', e);
        this.httpErrorHandler.process(e);
        this.getLastIdLoading = false;
      }
    });    
  }

  private procesarRedireccion(): void {
    switch (this.navigate) {
      case 'nuevasuscripcioncliente':
        this.router.navigate([`/app/clientes/${this.idcliente}/suscripciones/${this.idsuscripcionNav}`]);
        break;
      case 'nuevasuscripciongeneral':
        this.router.navigate([`/app/suscripciones/${this.idsuscripcionNav}`]);
        break;
      default:
        break;
    }
  }

  getBarriosHttpParams(): HttpParams {
    var httpParams: HttpParams = new HttpParams().append('eliminado', 'false');
    return httpParams;
  }

  getHttpParamsTD(): HttpParams {
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    return params;
  }

}
