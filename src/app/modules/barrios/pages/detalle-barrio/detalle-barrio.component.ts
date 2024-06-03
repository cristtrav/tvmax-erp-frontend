import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Barrio } from '@dto/barrio-dto';
import { Distrito } from '@dto/distrito-dto';
import { BarriosService } from '@services/barrios.service';
import { DistritosService } from '@services/distritos.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-barrio',
  templateUrl: './detalle-barrio.component.html',
  styleUrls: ['./detalle-barrio.component.scss']
})
export class DetalleBarrioComponent implements OnInit {

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ID_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

  idbarrio = 'nuevo';
  
  form = new FormGroup({
    id: new FormControl<null | number>(null, [Validators.required]),
    descripcion: new FormControl<null | string>(null, [Validators.required, Validators.maxLength(150)]),
    iddistrito: new FormControl<null | string>(null, [Validators.required])
  });

  lstDistritos: Distrito[] = [];
  formLoading: boolean = false;
  guardarLoading: boolean = false;
  lastIdLoading: boolean = false;

  constructor(
    private distSrv: DistritosService,
    private notif: NzNotificationService,
    private barrioSrv: BarriosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const idStr = this.aroute.snapshot.paramMap.get('id');
    this.idbarrio = idStr != null ? idStr : 'nuevo';
    if(Number.isInteger(Number(idStr))) this.cargarDatos();
    this.cargarDistritos();
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.barrioSrv
      .getPorId(Number(this.idbarrio))
      .pipe(finalize(() => this.formLoading = false))
      .subscribe({
        next: (data) => {
          this.form.controls.id.setValue(data.id);
          this.form.controls.descripcion.setValue(data.descripcion);
          this.form.controls.iddistrito.setValue(data.iddistrito);       
        },
        error: (e) => {
          console.error('Error al cargar datos del barrio', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  cargarDistritos(): void {
    this.distSrv.get(this.getHttpParamsDistrito()).subscribe({
      next: (distritos) => {
        this.lstDistritos = distritos;
      },
      error: (e) => {
        console.error('Error al cargar distritos', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  guardar(): void {
    if (this.form.valid && this.idbarrio == 'nuevo') this.registrar();
    if (this.form.valid && Number.isInteger(Number(this.idbarrio))) this.modificar();
  }

  private getDto(): Barrio {
    const b: Barrio = new Barrio();
    b.id = this.form.controls.id.value;
    b.descripcion = this.form.controls.descripcion.value;
    b.iddistrito = this.form.controls.iddistrito.value;
    return b;
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.barrioSrv
      .post(this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.form.reset();
          this.notif.success('Guardado correctamente', '');
        },
        error: (e) => {
          console.error('Error al registrar barrio', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const b: Barrio = this.getDto();
    this.barrioSrv
      .put(Number(this.idbarrio), b)
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.success('Guardado correctamente', '');
          this.idbarrio = `${b.id}`;
          this.router.navigate([b.id], {relativeTo: this.aroute.parent});          
        },
        error: (e) => {
          console.error('Error al modificar barrio', e);      
          this.httpErrorHandler.process(e);
        }
      });
  }

  getHttpParamsDistrito(): HttpParams{
    var params: HttpParams = new HttpParams().append('eliminado', 'false');
    return params;
  }

  cargarId(): void{
    this.lastIdLoading = true;
    this.barrioSrv
      .getLastId()
      .pipe(finalize(() => this.lastIdLoading = false))
      .subscribe({
        next: (id) => {
          this.form.get('id')?.setValue(id+1);        
        },
        error: (e) => {
          console.error('Error al consultar ultimo id de barrios', e);        
          this.httpErrorHandler.process(e);
        }
      });
  }

}
