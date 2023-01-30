import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Barrio } from './../../../dto/barrio-dto';
import { BarriosService } from './../../../servicios/barrios.service';
import { Domicilio } from 'src/app/dto/domicilio-dto';
import { DomiciliosService } from './../../../servicios/domicilios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from 'src/app/util/http-error-response-handler.service';

@Component({
  selector: 'app-form-domicilio',
  templateUrl: './form-domicilio.component.html',
  styleUrls: ['./form-domicilio.component.scss']
})
export class FormDomicilioComponent implements OnInit {

  @Input()
  iddomicilio = 'nuevo';
  @Output()
  iddomicilioChange = new EventEmitter<string>();
  @Input()
  idcliente: number | null = null;
  lstBarrios: Barrio[] = []
  idsuscripcionNav: string | null = 'nueva';
  navigate: string | null = '';

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    direccion: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
    idbarrio: new FormControl(null, [Validators.required]),
    nromedidor: new FormControl(null, Validators.maxLength(30)),
    tipo: new FormControl(null, [Validators.required]),
    observacion: new FormControl(null, [Validators.maxLength(150)]),
    principal: new FormControl(false)
  });

  guardarLoading: boolean = false;
  formLoading: boolean = false;
  getLastIdLoading: boolean = false;

  constructor(
    private barriosSrv: BarriosService,
    private notif: NzNotificationService,
    private domicilioSrv: DomiciliosService,
    private router: Router,
    private aroute: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarBarrios();
    if (Number.isInteger(Number(this.iddomicilio))) this.cargarDatos();
    this.navigate = this.aroute.snapshot.queryParamMap.get('navigate');
    this.idsuscripcionNav = this.aroute.snapshot.queryParamMap.get('idsuscripcion');
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.domicilioSrv.getPorId(Number(this.iddomicilio)).subscribe({
      next: (domicilio) => {
        this.form.controls.id.setValue(domicilio.id);
        this.form.controls.direccion.setValue(domicilio.direccion);
        this.form.controls.idbarrio.setValue(domicilio.idbarrio);
        this.form.controls.tipo.setValue(domicilio.tipo);
        this.form.controls.nromedidor.setValue(domicilio.nromedidor);
        this.form.controls.observacion.setValue(domicilio.observacion);
        this.form.controls.principal.setValue(domicilio.principal);
        this.formLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar domicilio por ID', e);
        this.httpErrorHandler.process(e);
        this.formLoading = false;
      }
    })
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
    domi.idcliente = this.idcliente;
    domi.tipo = this.form.get('tipo')?.value;
    domi.nromedidor = this.form.get('nromedidor')?.value;
    domi.observacion = this.form.get('observacion')?.value;
    domi.principal = this.form.get('principal')?.value;
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
