import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Barrio } from './../../../dto/barrio-dto';
import { BarriosService } from './../../../servicios/barrios.service';
import { TipoDomicilio } from './../../../dto/tipodomicilio-dto';
import { TiposdomiciliosService } from './../../../servicios/tiposdomicilios.service';
import { Domicilio } from 'src/app/dto/domicilio-dto';
import { DomiciliosService } from './../../../servicios/domicilios.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-domicilio',
  templateUrl: './form-domicilio.component.html',
  styleUrls: ['./form-domicilio.component.scss']
})
export class FormDomicilioComponent implements OnInit {

  @Input()
  iddomicilio = 'nuevo';
  @Input()
  idcliente: number | null = null;
  lstBarrios: Barrio[] = []
  lstTiposDomicilios: TipoDomicilio[] = [];
  navigate: string | null = null;

  form: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    direccion: [null, [Validators.required, Validators.maxLength(200)]],
    idbarrio: [null, [Validators.required]],
    nromedidor: [null, Validators.maxLength(30)],
    idtipodomicilio: [null, [Validators.required]],
    observacion: [null, [Validators.maxLength(150)]],
    principal: [false]
  });

  guardarLoading: boolean = false;
  formLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private barriosSrv: BarriosService,
    private notif: NzNotificationService,
    private tipoDomiSrv: TiposdomiciliosService,
    private domiSrv: DomiciliosService,
    private router: Router,
    private aroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarBarrios();
    this.cargarTiposDomicilios();
    console.log(`Iddomiciliio ${this.iddomicilio}`);
    if (this.iddomicilio !== 'nuevo') {
      this.cargarDatos();
    }else{
      this.consultarUltimoId();
    }
    this.navigate = this.aroute.snapshot.queryParamMap.get('navigate');
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.domiSrv.getPorId(+this.iddomicilio).subscribe((data) => {
      this.form.get('id')?.setValue(data.id);
      this.form.get('direccion')?.setValue(data.direccion);
      this.form.get('idbarrio')?.setValue(data.idbarrio);
      this.form.get('idtipodomicilio')?.setValue(data.idtipodomicilio);
      this.form.get('nromedidor')?.setValue(data.nromedidor);
      this.form.get('observacion')?.setValue(data.observacion);
      this.form.get('principal')?.setValue(data.principal);
      this.formLoading = true;
    }, (e) => {
      console.log('Error al cargar datos del domicilio');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos del domicilio', e.error);
      this.formLoading = true;
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

  private cargarTiposDomicilios(): void {
    this.tipoDomiSrv.get().subscribe((data) => {
      this.lstTiposDomicilios = data;
    }, (e) => {
      console.log('Error al cargar tipos de domicilios');
      console.log(e);
      this.notif.create('error', 'Error al cargar tipos de domicilios', e.error);
    });
  }

  private cargarBarrios(): void {
    this.barriosSrv.get().subscribe((data) => {
      this.lstBarrios = data;
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
    domi.idtipodomicilio = this.form.get('idtipodomicilio')?.value;
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
      this.notif.create('error', 'Error al guardar', e.error);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const domi = this.getDto();
    this.domiSrv.put(+this.iddomicilio, domi).subscribe(() => {
      this.notif.create('success', 'Domicilio guardado correctamente', '');
      this.iddomicilio = `${domi.id}`;
      this.router.navigateByUrl(`../${domi.id}`);
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar domicilio');
      console.log(e);
      this.notif.create('error', 'Error al guardar', e.error);
      this.guardarLoading = false;
    });
  }

  private consultarUltimoId(): void {
    this.domiSrv.getUltimoId().subscribe((data) => {
      const uid = data.ultimoid;
      if (uid) {
        this.form.get('id')?.setValue(uid + 1);
      } else {
        this.form.get('id')?.setValue(1);
      }
    }, (e) => {
      console.log('Error al consultar ultimo ID de domicilio');
      console.log(e);
      this.notif.create('error', 'Error al consultar código disponible', e.error);
    });
  }

  private procesarRedireccion(): void{
    if(this.navigate){
      switch(this.navigate){
        case 'nuevasuscripcion':
          this.router.navigateByUrl(`/clientes/${this.idcliente}/suscripciones/nueva`);
          break;
        default:
          break;
      }
    }
  }

}
