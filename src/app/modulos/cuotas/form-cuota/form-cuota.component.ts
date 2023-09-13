import { HttpParams } from "@angular/common/http";
import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CuotaDTO } from "@dto/cuota-dto";
import { Servicio } from "@dto/servicio-dto";
import { Suscripcion } from "@dto/suscripcion-dto";
import { CuotasService } from "@servicios/cuotas.service";
import { ServiciosService } from "@servicios/servicios.service";
import { SuscripcionesService } from "@servicios/suscripciones.service";
import { Extra } from "@util/extra";
import { HttpErrorResponseHandlerService } from "@util/http-error-response-handler.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { mergeMap, forkJoin, of } from "rxjs";


@Component({
  selector: 'app-form-cuota',
  templateUrl: './form-cuota.component.html',
  styleUrls: ['./form-cuota.component.scss']
})
export class FormCuotaComponent implements OnInit {

  opcionesServicios: { value: number, label: string, isLeaf: boolean, children?: { value: number, label: string, isLeaf: boolean }[] }[] = [];

  form: FormGroup = new FormGroup({
    idservicio: new FormControl(null, [Validators.required]),
    fechavencimiento: new FormControl(null, [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    nrocuota: new FormControl(null),
    observacion: new FormControl(null, [Validators.maxLength(150)])
  });

  guardarLoading: boolean = false;
  formLoading: boolean = false;
  @Input()
  idsuscripcion: number | null = null;
  @Input()
  idcuota = 'nueva';
  lstServicios: Servicio[] = [];
  suscripcionActual: Suscripcion | null = null;
  private validandoFormulario: boolean = false;

  constructor(
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private cuotaSrv: CuotasService,
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarGruposServicios();
    if (this.idcuota && this.idcuota !== 'nueva') this.cargarDatos();
    this.form.get('idservicio')?.valueChanges.subscribe((value: number[]) => {
      console.log(value);
      if (value && value.length > 0) {
        const idservicio = value[value.length - 1];
        if(!this.validandoFormulario)
          this.form.controls.monto.setValue(this.lstServicios.find(srv => srv.id == idservicio)?.precio);
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
      }
    })
  }

  private getDto(): CuotaDTO {
    const c: CuotaDTO = new CuotaDTO();
    if (this.idcuota !== 'nueva') c.id = Number(this.idcuota);
    const idservicioIndex = this.form.controls.idservicio.value.length - 1;
    c.idservicio = this.form.get('idservicio')?.value[idservicioIndex];
    c.monto = this.form.get('monto')?.value;
    c.nrocuota = this.form.get('nrocuota')?.value;
    const obs = this.form.get('observacion')?.value;
    if (obs) c.observacion = obs === '' ? null : obs;
    const fv = this.form.get('fechavencimiento')?.value;
    if (fv) c.fechavencimiento = Extra.dateToString(fv);
    c.idsuscripcion = this.idsuscripcion;
    return c;
  }

  guardar(): void {
    this.validandoFormulario = true;
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    this.validandoFormulario = false;
    if (this.form.valid) {
      if (this.idcuota === 'nueva') this.registrar();
      else this.modificar();
    }
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.cuotaSrv.post(this.getDto()).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Cuota registrada');
        this.form.reset();
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al registrar cuota', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const cuota = this.getDto();
    this.cuotaSrv.put(Number(this.idcuota), cuota).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Cuota editada');
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al editar cuota', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  private cargarDatos() {
    this.formLoading = true;
    this.cuotaSrv.getPorId(Number(this.idcuota)).pipe(
      mergeMap(cuota => forkJoin({
        cuota: of(cuota),
        servicio: this.serviciosSrv.getServicioPorId(Number(cuota.idservicio))
      }))
    ).subscribe({
      next: (resp) => {
        if(resp.servicio.suscribible) this.form.get('idservicio')?.setValue([resp.servicio.id]);
        else this.form.get('idservicio')?.setValue([resp.servicio.idgrupo ,resp.servicio.id]);
        this.form.get('fechavencimiento')?.setValue(resp.cuota.fechavencimiento);
        this.form.get('monto')?.setValue(resp.cuota.monto);
        this.form.get('nrocuota')?.setValue(resp.cuota.nrocuota);
        this.form.get('observacion')?.setValue(resp.cuota.observacion);
        this.formLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar datos de la cuota o el servicio', e);
        this.httpErrorHandler.process(e);
        this.formLoading = false;
      }
    });
  }
}
