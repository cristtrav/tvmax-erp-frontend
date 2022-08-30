import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Barrio } from './../../../dto/barrio-dto';
import { Distrito } from './../../../dto/distrito-dto';
import { DistritosService } from './../../../servicios/distritos.service';
import { BarriosService } from './../../../servicios/barrios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { ServerResponseList } from '../../../dto/server-response-list.dto';

@Component({
  selector: 'app-detalle-barrio',
  templateUrl: './detalle-barrio.component.html',
  styleUrls: ['./detalle-barrio.component.scss']
})
export class DetalleBarrioComponent implements OnInit {

  idbarrio = 'nuevo';
  form: UntypedFormGroup = this.fb.group({
    id: [null, [Validators.required]],
    descripcion: [null, [Validators.required, Validators.maxLength(150)]],
    iddistrito: [null, [Validators.required]]
  });
  lstDist: Distrito[] = [];
  formLoading: boolean = false;
  guardarLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private distSrv: DistritosService,
    private notif: NzNotificationService,
    private barrioSrv: BarriosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const id = this.aroute.snapshot.paramMap.get('id');
    if (id !== null) {
      this.idbarrio = id;
      if (id !== 'nuevo') {
        this.cargarDatos();
      }
    }
    this.cargarDistritos();
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.barrioSrv.getPorId(+this.idbarrio).subscribe((data) => {
      this.form.get('id')?.setValue(data.id);
      this.form.get('descripcion')?.setValue(data.descripcion);
      this.form.get('iddistrito')?.setValue(data.iddistrito);
      this.formLoading = false;
    }, (e) => {
      console.log('Error al cargar datos del barrio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      //this.notif.create('error', 'Error al cargar datos del barrio', e.error);
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

  cargarDistritos(): void {
    this.distSrv.get(this.getHttpParamsDistrito()).subscribe((resp: ServerResponseList<Distrito>) => {
      this.lstDist = resp.data;
    }, (e) => {
      console.log('Error al cargar distritos');
      console.log(e);
      this.notif.create('error', 'Error al cargar distritos', e.error);
    });
  }

  guardar(): void {
    if (this.validado()) {
      if (this.idbarrio === 'nuevo') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
  }

  private getDto(): Barrio {
    const b: Barrio = new Barrio();
    b.id = this.form.get('id')?.value;
    b.descripcion = this.form.get('descripcion')?.value;
    b.iddistrito = this.form.get('iddistrito')?.value;
    return b;
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.barrioSrv.post(this.getDto()).subscribe(() => {
      this.form.reset();
      this.notif.create('success', 'Guardado correctamente', '');
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al registrar barrio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const b: Barrio = this.getDto();
    this.barrioSrv.put(+this.idbarrio, b).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.idbarrio = `${b.id}`;
      this.router.navigate([b.id], {relativeTo: this.aroute.parent});
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar barrio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.guardarLoading = false;
    });
  }

  getHttpParamsDistrito(): HttpParams{
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    return params;
  }

}
