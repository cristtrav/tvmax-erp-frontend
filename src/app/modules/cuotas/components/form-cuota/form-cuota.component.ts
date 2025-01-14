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
import { mergeMap, forkJoin, of, finalize, Observable, catchError, defer, Subscription } from "rxjs";
import { formatDate } from "@angular/common";
import { ResponsiveUtils } from "@util/responsive/responsive-utils";

@Component({
  selector: 'app-form-cuota',
  templateUrl: './form-cuota.component.html',
  styleUrls: ['./form-cuota.component.scss']
})
export class FormCuotaComponent implements OnInit {

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROLS_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly ACTION_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

  @Input()
  idsuscripcion: number | null = null;
  @Input()
  idcuota = 'nueva';

  opcionesServicios: { value: number, label: string, isLeaf: boolean, children?: { value: number, label: string, isLeaf: boolean }[] }[] = [];

  form: FormGroup = new FormGroup({
    idservicio: new FormControl(null, [Validators.required]),
    fechavencimiento: new FormControl<Date | null>(null, [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    nrocuota: new FormControl(null),
    observacion: new FormControl(null, [Validators.maxLength(150)]),
    pagado: new FormControl<boolean>(false, [Validators.required]),
    exonerado: new FormControl<boolean>(false, [Validators.required])
  });

  cuotaEditar?: CuotaDTO;
  guardando: boolean = false;
  loadingDatos: boolean = false;
  loadingGruposServicios: boolean = false;
  lstServicios: Servicio[] = [];
  suscripcionActual: Suscripcion | null = null;

  idservicioSubscription?: Subscription;
  exoneradoSubscription?: Subscription;

  constructor(
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private cuotaSrv: CuotasService,
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    const observables: DatosInicialesObservables = {
      gruposServicios: this.cargarGruposServiciosObs()
    }
    if(this.idcuota != 'nueva') observables.datosCuota = this.cargarDatosObs();
    if(this.idsuscripcion) observables.suscripcionActual = this.suscripcionesSrv.getPorId(this.idsuscripcion);

    forkJoin(observables)
    .pipe(finalize(() => this.asignarSuscripcionesForm()))
    .subscribe(resp => {
      this.suscripcionActual = resp.suscripcionActual ?? null;
      this.gruposServiciosSuscribeNext(resp.gruposServicios);
      if(resp.datosCuota) this.cargarDatosSuscribeNext(resp.datosCuota);
    })
  }

  private asignarSuscripcionesForm(){
    this.idservicioSubscription = this.form.controls.idservicio.valueChanges.subscribe((value: number[]) => {
      if(!value || (value && value.length == 0)){
        this.form.controls.monto.reset();
        return;
      }
      if(this.form.controls.exonerado.value){
        this.form.controls.monto.setValue(0);
        return;
      }
      this.form.controls.monto.setValue(this.getMontoCuota());
    });

    this.exoneradoSubscription = this.form.controls.exonerado.valueChanges.subscribe(value => {
        if(value){
          this.form.controls.monto.setValue(0);
          this.form.controls.pagado.setValue(true);
        }else{
          this.form.controls.monto.setValue(this.getMontoCuota());
          if(this.idcuota == 'nueva'){
            this.form.controls.pagado.setValue(false)
          }else if(this.cuotaEditar?.monto == 0){
            this.form.controls.pagado.setValue(false)
          }else{
            this.form.controls.pagado.setValue(this.cuotaEditar?.pagado)
          }
        }
    });
  }

  private limpiarSuscripcionesForm(){
    this.idservicioSubscription?.unsubscribe();
    this.exoneradoSubscription?.unsubscribe();
  }

  private getMontoCuota(): number | null {
    if(this.form.controls.idservicio.value == null) return null;
    if(this.suscripcionActual != null && this.getIdServicioSeleccionado() == this.suscripcionActual.idservicio)
      return this.suscripcionActual.monto;
    else
      return this.lstServicios.find(srv => srv.id == this.getIdServicioSeleccionado())?.precio ?? null;
  }

  private getIdServicioSeleccionado(): number | null {
    if (this.form.controls.idservicio.value == null) return null;
    return this.form.controls.idservicio.value[this.form.controls.idservicio.value.length - 1]
  }

  private cargarGruposServiciosObs(): Observable<GruposServiciosType>{
    let param: HttpParams = new HttpParams()
      .append('sort', '+descripcion')
      .append('eliminado', 'false')
      .append('suscribible', 'false');
    
    return defer(() => {
      this.loadingGruposServicios = true;
      return this.suscripcionesSrv
        .getPorId(Number(this.idsuscripcion))
        .pipe(
          mergeMap(sus => forkJoin({
            servicioSuscripcion: this.serviciosSrv.getServicioPorId(Number(sus.idservicio)),
            servicios: this.serviciosSrv.getServicios(param)
          })),
          catchError(e => {
            console.log('Error al cargar servicios', e);
            this.httpErrorHandler.process(e);
            throw e;
          })
        );
    }).pipe(finalize(() => this.loadingGruposServicios = false));
  }

  private gruposServiciosSuscribeNext(resp: GruposServiciosType){
    const opciones: { value: number, label: string, isLeaf: boolean, children?: { value: number, label: string, isLeaf: boolean }[] }[] = [];
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

  private getDTO(): CuotaDTO {
    const fechavencimiento = this.form.get('fechavencimiento')?.value;

    const c: CuotaDTO = {
      id: this.idcuota!= 'nueva' ? Number(this.idcuota) : undefined,
      idservicio: this.getIdServicioSeleccionado() ?? undefined,
      monto: this.form.controls.monto.value,
      nrocuota: this.form.controls.nrocuota.value,
      observacion: this.form.controls.observacion.value,
      fechavencimiento: fechavencimiento ? formatDate(fechavencimiento, 'yyyy-MM-dd', this.locale) : undefined,
      idsuscripcion: this.idsuscripcion ?? undefined,
      pagado: this.form.controls.pagado.value
    };

    if(this.cuotaEditar) return { ...this.cuotaEditar, ...c};
    else return c;
  }

  guardar(): void {
    this.limpiarSuscripcionesForm();
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    this.asignarSuscripcionesForm();
    if (this.form.valid && this.idcuota == 'nueva') this.registrar();
    if (this.form.valid && Number.isInteger(Number(this.idcuota))) this.modificar();
  }

  private registrar(): void {
    this.guardando = true;
    this.cuotaSrv
      .post(this.getDTO())
      .pipe(finalize(() => this.guardando = false))
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
    this.guardando = true;
    this.cuotaSrv
      .put(Number(this.idcuota), this.getDTO())
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => this.notif.create('success', '<strong>Éxito</strong>', 'Cuota editada'),
        error: (e) => {
          console.error('Error al editar cuota', e);
          this.httpErrorHandler.process(e);
        }
    });
  }

  private cargarDatosObs(): Observable<DatosCuotaType>{
    return defer(() => {
      this.loadingDatos = true;
      return this.cuotaSrv.getPorId(Number(this.idcuota))
        .pipe(
          mergeMap(cuota => forkJoin({
            cuota: of(cuota),
            servicio: this.serviciosSrv.getServicioPorId(Number(cuota.idservicio))
          }))
        );
    }).pipe(finalize(() => this.loadingDatos = false))
  }

  private cargarDatosSuscribeNext(resp: DatosCuotaType){
    this.cuotaEditar = resp.cuota;
    if(resp.servicio.suscribible) this.form.get('idservicio')?.setValue([resp.servicio.id]);
    else this.form.controls.idservicio.setValue([resp.servicio.idgrupo ,resp.servicio.id]);
    if(resp.cuota.fechavencimiento)
      this.form.controls.fechavencimiento.setValue(new Date(resp.cuota.fechavencimiento));
    this.form.controls.monto.setValue(resp.cuota.monto);
    this.form.controls.nrocuota.setValue(resp.cuota.nrocuota);
    this.form.controls.observacion.setValue(resp.cuota.observacion);
    this.form.controls.exonerado.setValue(resp.cuota.pagado && resp.cuota.monto == 0);
    this.form.controls.pagado.setValue(resp.cuota.pagado);
  }
}

type GruposServiciosType = { servicioSuscripcion: Servicio, servicios: Servicio[] }
type DatosCuotaType = { cuota: CuotaDTO, servicio: Servicio }
type DatosInicialesObservables = {
  gruposServicios: Observable<GruposServiciosType>,
  datosCuota?: Observable<DatosCuotaType>,
  suscripcionActual?: Observable<Suscripcion>
}
