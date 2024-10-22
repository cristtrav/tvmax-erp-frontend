import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CiudadSifenDTO } from '@dto/ciudad-sifen.dto';
import { DepartamentoSifenDTO } from '@dto/departamento-sifen.dto';
import { DistritoSifenDTO } from '@dto/distrito-sifen.dto';
import { EstablecimientoDTO } from '@dto/facturacion/establecimiento.dto';
import { EstablecimientosService } from '@services/facturacion/establecimientos.service';
import { UbicacionesSifenService } from '@services/ubicaciones-sifen.service';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-establecimiento',
  templateUrl: './detalle-establecimiento.component.html',
  styleUrls: ['./detalle-establecimiento.component.scss']
})
export class DetalleEstablecimientoComponent implements OnInit {

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;
  readonly SMALL_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12}

  idestablecimiento: string = 'nuevo';
  lstDepartamentos: DepartamentoSifenDTO[] = [];
  lstDistritos: DistritoSifenDTO[] = [];
  lstCiudades: CiudadSifenDTO[] = [];

  cargandoDatos: boolean = false;
  cargandoDepartamentos: boolean = false;
  cargandoDistritos: boolean = false;
  cargandoCiudades: boolean = false;
  guardando: boolean = false;
  validando: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    denominacion: new FormControl(null, [Validators.required, Validators.maxLength(60)]),
    direccion: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
    nrocasa: new FormControl(null, [Validators.required]),
    coddepartamento: new FormControl(null, [Validators.required]),
    coddistrito: new FormControl(null, [Validators.required]),
    codciudad: new FormControl(null, [Validators.required]),
    telefono: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required])
  });

  constructor(
    private ubicaionesSifenSrv: UbicacionesSifenService,
    private establecimientosSrv: EstablecimientosService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private router: Router
  ){}
  
  ngOnInit(): void {
    this.cargarDepartamentos();
    this.form.controls.coddepartamento.valueChanges.subscribe(value => {
      if(this.validando) return;

      this.form.controls.coddistrito.setValue(null);
      if(value == null) this.lstDistritos = [];
      else this.cargarDistritos(value);
    });
    this.form.controls.coddistrito.valueChanges.subscribe(value => {
      if(this.validando) return;

      this.form.controls.codciudad.setValue(null);
      if(value == null) this.lstCiudades = []
      else this.cargarCiudades(value);
    });
    const idEstab = this.aroute.snapshot.paramMap.get('idestablecimiento');
    this.idestablecimiento = Number.isInteger(Number(idEstab)) ? `${idEstab}` : 'nuevo';
    if(this.idestablecimiento != 'nuevo') this.cargarDatos(Number(this.idestablecimiento));
  }

  private cargarDepartamentos(){
    this.cargandoDepartamentos = true;
    this.ubicaionesSifenSrv.findAllDepartamentos(new HttpParams())
    .pipe(finalize(() => this.cargandoDepartamentos = false))
    .subscribe(departamentos => this.lstDepartamentos = departamentos);
  }

  private cargarDistritos(codDepartamento: number){
    this.cargandoDistritos = false;
    this.ubicaionesSifenSrv.findDistritosByDepartamento(codDepartamento)
    .pipe(finalize(() => this.cargandoDistritos = false))
    .subscribe(distritos => this.lstDistritos = distritos);
  }

  private cargarCiudades(codDistrito: number){
    this.cargandoCiudades = true;
    this.ubicaionesSifenSrv.findCiudadesByDistrito(codDistrito)
    .pipe(finalize(() => this.cargandoCiudades = false))
    .subscribe(ciudades => this.lstCiudades = ciudades);
  }

  guardar(){
    this.validando = true;
    Object.keys(this.form.controls).forEach(ctrl => {
      this.form.get(ctrl)?.markAsDirty();
      this.form.get(ctrl)?.updateValueAndValidity();
    });
    this.validando = false;
    if(!this.form.valid) return;
    if(this.idestablecimiento == 'nuevo') this.registrar();
    else this.editar();
  }

  private registrar(){
    this.guardando = true;
    this.establecimientosSrv.post(this.getDTO())
    .pipe(finalize(() => this.guardando = false))
    .subscribe(() => this.notif.success('<strong>Éxito</strong>', 'Establecimiento registrado'));
  }

  private editar(){
    this.guardando = false;
    this.establecimientosSrv.put(Number(this.idestablecimiento),this.getDTO())
    .pipe(finalize(() => this.guardando = false))
    .subscribe(() => {
      this.notif.success('<strong>Éxito</strong>', 'Establecimiento editado');
      this.idestablecimiento = `${this.getDTO().id}`;
      this.router.navigate([this.getDTO().id], { relativeTo: this.aroute.parent });
    })
  }

  private getDTO(): EstablecimientoDTO{
    return {
      id: this.form.controls.id.value,
      denominacion: this.form.controls.denominacion.value,
      direccion: this.form.controls.direccion.value,
      nrocasa: this.form.controls.nrocasa.value,
      coddepartamento: this.form.controls.coddepartamento.value,
      departamento: this.lstDepartamentos.find(d => d.codDepartamento == this.form.controls.coddepartamento.value)?.departamento ?? '',
      coddistrito: this.form.controls.coddistrito.value,
      distrito: this.lstDistritos.find(d => d.codDistrito == this.form.controls.coddistrito.value)?.distrito ?? '',
      codciudad: this.form.controls.codciudad.value,
      ciudad: this.lstCiudades.find(c => c.codCiudad == this.form.controls.codciudad.value)?.ciudad ?? '',
      telefono: this.form.controls.telefono.value,
      email: this.form.controls.email.value,
    }
  }

  cargarDatos(id: number){
    this.cargandoDatos = true;
    this.establecimientosSrv.getById(id)
    .pipe(finalize(() => this.cargandoDatos = false))
    .subscribe(establecimiento => {
      this.form.controls.id.setValue(establecimiento.id);
      this.form.controls.denominacion.setValue(establecimiento.denominacion);
      this.form.controls.direccion.setValue(establecimiento.direccion);
      this.form.controls.nrocasa.setValue(establecimiento.nrocasa);
      this.form.controls.coddepartamento.setValue(establecimiento.coddepartamento);
      this.form.controls.coddistrito.setValue(establecimiento.coddistrito);
      this.form.controls.codciudad.setValue(establecimiento.codciudad);
      this.form.controls.telefono.setValue(establecimiento.telefono);
      this.form.controls.email.setValue(establecimiento.email);
    })
  }

}
