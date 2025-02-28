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
import { CuotaGrupoDTO } from "@dto/cuota-grupo.dto";
import { ResponsiveSizes } from "@util/responsive/responsive-sizes.interface";
import { GruposCuotasService } from "@services/grupos-cuotas.service";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: 'app-form-cuota',
  templateUrl: './form-cuota.component.html',
  styleUrls: ['./form-cuota.component.scss']
})
export class FormCuotaComponent implements OnInit {

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROLS_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly HALF_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 }
  readonly ACTION_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

  readonly cantMin = 1;
  readonly cantMax = 32;

  @Input()
  idsuscripcion: number | null = null;
  @Input()
  idcuota = 'nueva';

  opcionesServicios: { value: number, label: string, isLeaf: boolean, children?: { value: number, label: string, isLeaf: boolean }[] }[] = [];

  form: FormGroup = new FormGroup({
    cantidad: new FormControl<number>(1, [Validators.required, Validators.min(this.cantMin), Validators.max(this.cantMax)]),
    idservicio: new FormControl(null, [Validators.required]),
    fechavencimiento: new FormControl<Date | null>(null, [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    nrocuota: new FormControl(null),
    observacion: new FormControl(null, [Validators.maxLength(150)]),
    pagado: new FormControl<boolean>(false, [Validators.required]),
    exonerado: new FormControl<boolean>(false, [Validators.required]),
    codigogrupo: new FormControl<null | string>(null, [Validators.maxLength(10)])
  });

  cuotaEditar?: CuotaDTO;
  guardando: boolean = false;
  loadingDatos: boolean = false;
  loadingGruposServicios: boolean = false;
  lstServicios: Servicio[] = [];
  suscripcionActual: Suscripcion | null = null;

  idservicioSubscription?: Subscription;
  exoneradoSubscription?: Subscription;

  lstCuotasGrupos: CuotaGrupoDTO[] = [];
  loadingCuotasGrupos: boolean = false;
  guardandoCuotaGrupo: boolean = false;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService,
    private cuotaSrv: CuotasService,
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private gruposCuotasSrv: GruposCuotasService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    const observables: DatosInicialesObservables = {
      gruposServicios: this.cargarGruposServiciosObs(),
    }
    if(this.idcuota != 'nueva') {
      observables.datosCuota = this.cargarDatosObs();
      this.form.controls.cantidad.clearValidators();
    }
    if(this.idsuscripcion)
      observables.suscripcionActual = this.suscripcionesSrv.getPorId(this.idsuscripcion);

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
    this.form.controls.idservicio.valueChanges.subscribe(value => {
      if(value == null || value.length == 0 || this.idsuscripcion == null){
        this.lstCuotasGrupos = [];
      }else{
        this.cargarGruposCuotasObs(
          this.idsuscripcion,
          this.getIdServicioSeleccionado() ?? -1
        ).subscribe(grupos => this.cargarGruposCuotasNext(grupos));
      }
    })
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

  private cargarGruposCuotasObs(idsuscripcion: number, idservicio: number): Observable<CuotaGrupoDTO[]>{
    const params = new HttpParams()
      .append('idservicio', idservicio)
      .append('idsuscripcion', idsuscripcion)
      .append('activo', true);
      return defer(() => {
        this.loadingCuotasGrupos = true;
        return this.gruposCuotasSrv
          .get(params)
          .pipe(finalize(() => this.loadingCuotasGrupos = false));
      });
  }

  private cargarGruposCuotasNext(lstCuotasGrupos: CuotaGrupoDTO[]){
    this.lstCuotasGrupos = lstCuotasGrupos;
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
      pagado: this.form.controls.pagado.value,
      codigogrupo: this.form.controls.codigogrupo.value,
      cantidad: this.form.controls.cantidad.value
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
    if(!this.form.valid) return;
    if (this.idcuota == 'nueva'){
      if(this.form.controls.cantidad.value == 1) this.registrar();
      else this.confirmarGeneracion();
    } else this.modificar();
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
    const cuotaDto = this.getDTO();
    this.cuotaSrv
      .put(Number(this.idcuota), cuotaDto)
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.notif.create('success', '<strong>Éxito</strong>', 'Cuota editada');
          this.cargarGruposCuotasObs(
            cuotaDto.idsuscripcion ?? -1,
            cuotaDto.idservicio ?? -1
          ).subscribe(gruposCuotas => this.cargarGruposCuotasNext(gruposCuotas));
        },
        error: (e) => {
          console.error('Error al editar cuota', e);
          this.httpErrorHandler.process(e);
        }
    });
  }

  confirmarGeneracion(){
    const cant = this.form.controls.cantidad.value;
    const firstDate: Date = this.form.controls.fechavencimiento.value;
    const firstDateStr: string = formatDate(firstDate, 'dd/MMMM/yyyy', this.locale);
    const lastDate: Date = new Date(firstDate.getTime());
    lastDate.setMonth(lastDate.getMonth() + (cant - 1));
    const lastDateStr: string = formatDate(lastDate, 'dd/MMMM/yyyy', this.locale);
    
    if(cant == 1) this.registrar();
    else {
      const grupo = this.form.controls.codigogrupo.value;
      let modalContent = `<div>Desde ${firstDateStr} hasta ${lastDateStr}</div>`;
      if(grupo != null) modalContent = modalContent + `<div><strong>ENUMERAR (Grupo: ${grupo})</strong></div>`
      else modalContent = modalContent + `<div><strong>NO ENUMERAR<strong></div>`
      this.modal.confirm({
        nzTitle: `¿Desea generar ${cant} cuotas?`,
        nzContent: modalContent,
        nzOkText: `Generar`,
        nzOnOk: () => this.generarCuotas()
      });
    }
  }

  private generarCuotas(){
    this.guardando = true;
    const cuotaDto = this.getDTO();
    this.cuotaSrv.generarCuotasSuscripcion(cuotaDto)
    .pipe(finalize(() => this.guardando = false))
    .subscribe({
      next: (resp) => {
        if(cuotaDto.cantidad == resp.generado)
          this.notif.success('<strong>Éxito</strong>', `Se generaron ${cuotaDto.cantidad} cuotas.`);
        else if(resp.generado == 0)
          this.notif.error('<strong>Error al generar cuotas</strong>','');  
        else{
          let errors = resp.errors.map(e => `<div>${e}</div>`).join('');
          this.notif.warning(`<strong>Generadas ${resp.generado} de ${resp.total} cuotas.</strong>`, errors, { nzDuration: 10000 });
        } 
      }, 
      error: (e) => {
        console.error('Error al generar cuotas', e);
      }
    })
  }

  private cargarDatosObs(): Observable<DatosCuotaType>{
    return defer(() => {
      this.loadingDatos = true;
      return this.cuotaSrv.getPorId(Number(this.idcuota))
        .pipe(
          mergeMap(cuota => forkJoin({
            cuota: of(cuota),
            servicio: this.serviciosSrv.getServicioPorId(Number(cuota.idservicio)),
            cuotasGrupos: this.cargarGruposCuotasObs(cuota.idsuscripcion ?? -1, cuota.idservicio ?? -1)
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
    this.form.controls.codigogrupo.setValue(resp.cuota.codigogrupo);

    this.lstCuotasGrupos = resp.cuotasGrupos;
  }

  crearGrupoCuota(){
    this.guardandoCuotaGrupo = true;
    this.gruposCuotasSrv.post({
      idsuscripcion: this.idsuscripcion ?? -1,
      idservicio: this.getIdServicioSeleccionado() ?? -1,
      activo: true,
      codigo: 'X', //Se reemplaza en el backend
      totalcuotas: 0
    })
    .pipe(finalize(() => this.guardandoCuotaGrupo = false))
    .subscribe((grupo) =>{
      this.lstCuotasGrupos = this.lstCuotasGrupos.concat(grupo);
      this.form.controls.codigogrupo.setValue(grupo.codigo);
    })
  }
}

type GruposServiciosType = { servicioSuscripcion: Servicio, servicios: Servicio[] }
type DatosCuotaType = { cuota: CuotaDTO, servicio: Servicio, cuotasGrupos: CuotaGrupoDTO[] }
type DatosInicialesObservables = {
  gruposServicios: Observable<GruposServiciosType>,
  datosCuota?: Observable<DatosCuotaType>,
  suscripcionActual?: Observable<Suscripcion>,
}
