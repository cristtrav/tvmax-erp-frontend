import { HttpParams } from "@angular/common/http";
import { Component, OnInit, Input, Inject, LOCALE_ID } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CuotaDTO } from "@dto/cuota-dto";
import { Servicio } from "@dto/servicio-dto";
import { Suscripcion } from "@dto/suscripcion-dto";
import { CuotasService } from "@services/cuotas.service";
import { ServiciosService } from "@services/servicios.service";
import { SuscripcionesService } from "@services/suscripciones.service";
import { HttpErrorResponseHandlerService } from "@services/http-utils/http-error-response-handler.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { mergeMap, forkJoin, of, finalize } from "rxjs";
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-form-cuota',
  templateUrl: './form-cuota.component.html',
  styleUrls: ['./form-cuota.component.scss']
})
export class FormCuotaComponent implements OnInit {

  @Input()
  idsuscripcion: number | null = null;
  @Input()
  idcuota = 'nueva';

  opcionesServicios: { value: number, label: string, isLeaf: boolean, children?: { value: number, label: string, isLeaf: boolean }[] }[] = [];

  form: FormGroup = new FormGroup({
    idservicio: new FormControl(null, [Validators.required]),
    fechavencimiento: new FormControl(null, [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    nrocuota: new FormControl(null),
    observacion: new FormControl(null, [Validators.maxLength(150)])
  });

  cuotaEditar?: CuotaDTO;
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  lstServicios: Servicio[] = [];
  suscripcionActual: Suscripcion | null = null;
  private validandoFormulario: boolean = false;

  constructor(
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private cuotaSrv: CuotasService,
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    this.cargarGruposServicios();
    if (this.idcuota && this.idcuota !== 'nueva') this.cargarDatos();
    this.form.get('idservicio')?.valueChanges.subscribe((value: number[]) => {
      if (value && value.length > 0) {
        const idservicio = value[value.length - 1];
        this.suscripcionesSrv.getPorId(this.idsuscripcion ?? -1).subscribe({
          next: (suscripcion) => {
            if(!this.validandoFormulario){
              if(suscripcion.idservicio == idservicio && this.idcuota == 'nueva')
                this.form.controls.monto.setValue(suscripcion.monto);
              else  
                this.form.controls.monto.setValue(this.lstServicios.find(srv => srv.id == idservicio)?.precio);
            }
          },
          error: (e) => {
            console.log('Error al consultar suscripcion');
            if(!this.validandoFormulario)
              this.form.controls.monto.setValue(this.lstServicios.find(srv => srv.id == idservicio)?.precio);
          }
        });
      } else this.form.controls.monto.reset();
    });
  }

  private cargarGruposServicios() {
    let param: HttpParams = new HttpParams()
      .append('sort', '+descripcion')
      .append('eliminado', 'false')
      .append('suscribible', 'false');
    const opciones: { value: number, label: string, isLeaf: boolean, children?: { value: number, label: string, isLeaf: boolean }[] }[] = [];
    this.suscripcionesSrv.getPorId(Number(this.idsuscripcion)).pipe(
      mergeMap(sus => forkJoin({
        servicioSuscripcion: this.serviciosSrv.getServicioPorId(Number(sus.idservicio)),
        servicios: this.serviciosSrv.getServicios(param)
      }))
    ).subscribe({
      next: (resp) => {
        this.lstServicios = resp.servicios.concat(resp.servicioSuscripcion);
        opciones.push({
          value: resp.servicioSuscripcion.id ?? -1,
          label: `${resp.servicioSuscripcion.descripcion}`,
          isLeaf: true
        })
        resp.servicios.forEach(srv => {
          if (!opciones.find(op => op.value == srv.idgrupo)) {
            const serviciosGrupo = resp.servicios.filter(serv => serv.idgrupo == srv.idgrupo);
            opciones.push({
              value: srv.idgrupo ?? -1,
              label: `${srv.grupo}`,
              isLeaf: false,
              children: serviciosGrupo.map(servFilter => {
                return {
                  value: servFilter.id ?? -1,
                  label: `${servFilter.descripcion}`,
                  isLeaf: true
                }
              })
            });
          }
        });
        this.opcionesServicios = opciones;
      },
      error: (e) => {
        console.log('Error al cargar servicios', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private getDto(): CuotaDTO {
    const idservicioIndex = this.form.controls.idservicio.value.length - 1;
    const fechavencimiento = this.form.get('fechavencimiento')?.value;

    const c: CuotaDTO = {
      id: this.idcuota!= 'nueva' ? Number(this.idcuota) : undefined,
      idservicio: this.form.controls.idservicio.value[idservicioIndex],
      monto: this.form.controls.monto.value,
      nrocuota: this.form.controls.nrocuota.value,
      observacion: this.form.controls.observacion.value,
      fechavencimiento: fechavencimiento ? formatDate(fechavencimiento, 'yyyy-MM-dd', this.locale) : undefined,
      idsuscripcion: this.idsuscripcion ?? undefined,
    };

    if(this.cuotaEditar) return { ...this.cuotaEditar, ...c};
    else return c;
  }

  guardar(): void {
    this.validandoFormulario = true;
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    this.validandoFormulario = false;
    if (this.form.valid && this.idcuota == 'nueva') this.registrar();
    if (this.form.valid && Number.isInteger(Number(this.idcuota))) this.modificar();
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.cuotaSrv
      .post(this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Cuota registrada');
          this.form.reset();
        },
        error: (e) => {
          console.error('Error al registrar cuota', e);
          this.httpErrorHandler.process(e);
        }
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    this.cuotaSrv
      .put(Number(this.idcuota), this.getDto())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Cuota editada');
        },
        error: (e) => {
          console.error('Error al editar cuota', e);
          this.httpErrorHandler.process(e);
        }
    });
  }

  private cargarDatos() {
    this.formLoading = true;
    this.cuotaSrv
    .getPorId(Number(this.idcuota))
    .pipe(
      mergeMap(cuota => forkJoin({
        cuota: of(cuota),
        servicio: this.serviciosSrv.getServicioPorId(Number(cuota.idservicio))
      })),
      finalize(() => this.formLoading = false)
    )
    .subscribe({
      next: (resp) => {
        this.cuotaEditar = resp.cuota;
        if(resp.servicio.suscribible) this.form.get('idservicio')?.setValue([resp.servicio.id]);
        else this.form.get('idservicio')?.setValue([resp.servicio.idgrupo ,resp.servicio.id]);
        this.form.get('fechavencimiento')?.setValue(resp.cuota.fechavencimiento);
        this.form.get('monto')?.setValue(resp.cuota.monto);
        this.form.get('nrocuota')?.setValue(resp.cuota.nrocuota);
        this.form.get('observacion')?.setValue(resp.cuota.observacion);
      },
      error: (e) => {
        console.error('Error al cargar datos de la cuota o el servicio', e);
        this.httpErrorHandler.process(e);
      }
    });
  }
}
