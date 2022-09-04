import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Barrio } from './../../../dto/barrio-dto';
import { BarriosService } from './../../../servicios/barrios.service';
import { TipoDomicilio } from './../../../dto/tipodomicilio-dto';
import { TiposdomiciliosService } from './../../../servicios/tiposdomicilios.service';
import { Domicilio } from 'src/app/dto/domicilio-dto';
import { DomiciliosService } from './../../../servicios/domicilios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ServerResponseList } from '../../../dto/server-response-list.dto';
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

  form: UntypedFormGroup = this.fb.group({
    id: [null, [Validators.required]],
    direccion: [null, [Validators.required, Validators.maxLength(200)]],
    idbarrio: [null, [Validators.required]],
    nromedidor: [null, Validators.maxLength(30)],
    tipo: [null, [Validators.required]],
    observacion: [null, [Validators.maxLength(150)]],
    principal: [false]
  });

  guardarLoading: boolean = false;
  formLoading: boolean = false;
  calculateIdLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private barriosSrv: BarriosService,
    private notif: NzNotificationService,
    private domiSrv: DomiciliosService,
    private router: Router,
    private aroute: ActivatedRoute,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarBarrios();
    console.log(`Iddomiciliio ${this.iddomicilio}`);
    if (this.iddomicilio !== 'nuevo') {
      this.cargarDatos();
    }
    this.navigate = this.aroute.snapshot.queryParamMap.get('navigate');
    this.idsuscripcionNav = this.aroute.snapshot.queryParamMap.get('idsuscripcion');
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.domiSrv.getPorId(+this.iddomicilio).subscribe((data) => {
      this.form.get('id')?.setValue(data.id);
      this.form.get('direccion')?.setValue(data.direccion);
      this.form.get('idbarrio')?.setValue(data.idbarrio);
      this.form.get('tipo')?.setValue(data.tipo);
      this.form.get('nromedidor')?.setValue(data.nromedidor);
      this.form.get('observacion')?.setValue(data.observacion);
      this.form.get('principal')?.setValue(data.principal);
      this.formLoading = false;
    }, (e) => {
      console.log('Error al cargar datos del domicilio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.formLoading = false;
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

  private cargarBarrios(): void {
    this.barriosSrv.get(this.getBarriosHttpParams()).subscribe((resp: ServerResponseList<Barrio>) => {
      this.lstBarrios = resp.data;
    }, (e) => {
      console.log('Error al cargar barrios');
      console.log(e);
      this.notif.create('error', 'Error al cargar barrios', e.error);
    });
  }

  guardar(): void {
    if (this.validado()) {
      if (this.iddomicilio === 'nuevo') {
        this.registrar();
      } else {
        this.modificar();
      }
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
    this.domiSrv.post(this.getDto()).subscribe(() => {
      this.notif.create('success', 'Domicilio guardado correctamente', '');
      this.form.reset();
      this.procesarRedireccion();
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al registrar domicilio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const domi = this.getDto();
    this.domiSrv.put(+this.iddomicilio, domi).subscribe(() => {
      this.notif.create('success', 'Domicilio guardado correctamente', '');
      this.iddomicilio = `${domi.id}`;
      this.iddomicilioChange.emit(this.iddomicilio);
      this.router.navigate(['../',this.iddomicilio], {relativeTo: this.aroute});
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar domicilio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  consultarUltimoId(): void {
    this.calculateIdLoading = true;
    this.domiSrv.getUltimoId().subscribe((data) => {
      const uid = data;
      if (uid) {
        this.form.get('id')?.setValue(uid + 1);
      } else {
        this.form.get('id')?.setValue(1);
      }
      this.calculateIdLoading = false;
    }, (e) => {
      console.log('Error al consultar ultimo ID de domicilio');
      console.log(e);
      this.notif.create('error', 'Error al consultar código disponible', e.error);
      this.calculateIdLoading = false;
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
