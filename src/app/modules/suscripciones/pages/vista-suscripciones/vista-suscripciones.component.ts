import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { ImpresionService } from '@services/impresion.service';
import { ContenidoEstadisticasSuscripcionesComponent } from '../../../estadisticas/components/suscripciones/contenido-estadisticas-suscripciones/contenido-estadisticas-suscripciones.component';
import { TablaSuscripcionesComponent } from '../../components/tabla-suscripciones/tabla-suscripciones.component';
import { SesionService } from '@services/sesion.service';
import { CuotasService } from '@services/cuotas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';


@Component({
  selector: 'app-vista-suscripciones',
  templateUrl: './vista-suscripciones.component.html',
  styleUrls: ['./vista-suscripciones.component.scss']
})
export class VistaSuscripcionesComponent implements OnInit {

  @ViewChild("iframe") iframe!: ElementRef<HTMLIFrameElement>; // target host to render the printable
  @ViewChild(TablaSuscripcionesComponent)
  tablaSuscripcionesComp!: TablaSuscripcionesComponent;
  @ViewChild(ContenidoEstadisticasSuscripcionesComponent)
  estadisticasSuscripcionesComp!: ContenidoEstadisticasSuscripcionesComponent;

  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;

  vista: string = 'registros';
  cantFiltrosAplicados: number = 0;
  textoBusqueda: string = '';
  drawerFiltrosVisible: boolean = false;
  paramsFiltro: IParametroFiltro = {};
  loadingDatosReporte: boolean = false;
  componenteReporteRendered: boolean = false;
  dataLoading: boolean = false;

  modalGenerarCuotasVisisble: boolean = false;
  formGenerarCuota = new FormGroup({
    mesAnio: new FormControl<null | Date>(null, [Validators.required])
  });

  constructor(
    private aroute: ActivatedRoute, 
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private cuotasSrv: CuotasService,
    private notif: NzNotificationService,
    public impresionSrv: ImpresionService,
    public sesionSrv: SesionService
  ) { }

  ngOnInit(): void {
    const v: string | null = this.aroute.snapshot.queryParamMap.get('vista');
    this.cambiarVista(v === null ? 'registros' : v);
  }

  mostrarModalGenerarCuotas(){
    this.modalGenerarCuotasVisisble = true;
  }

  cerrarModalGenerarCuotas(){
    this.modalGenerarCuotasVisisble = false;
  }

  generarCuotas(){
    Object.keys(this.formGenerarCuota.controls).forEach(key => {
      this.formGenerarCuota.get(key)?.markAsDirty();
      this.formGenerarCuota.get(key)?.updateValueAndValidity();
    });
    if(!this.formGenerarCuota.valid) return;
    let fecha = this.formGenerarCuota.controls.mesAnio.value;
    if(fecha == null) return;

    this.cuotasSrv.generarCuotas(fecha.getMonth() + 1, fecha.getFullYear()).subscribe({
      next: () => {
        this.formGenerarCuota.reset();
        this.modalGenerarCuotasVisisble = false;
        this.notif.success('Éxito', 'Generación de cuotas en proceso.');
      },
      error: (e) => {
        console.error('Error al generar cuotas', e);
        this.notif.error('Error al generar cuotas', e);
      }
    });
  
  }

  cambiarVista(v: string) {
    this.vista = (v !== 'registros' && v !== 'estadisticas') ? 'registros' : v;
    this.router.navigate([], {
      relativeTo: this.aroute,
      queryParams: { vista: this.vista },
      queryParamsHandling: 'merge'
    });
  }

  public printWithSrv(): void {
    this.impresionSrv.imprimirReporteSuscripciones(this.iframe, this.paramsFiltro, this.viewContainerRef)
    .subscribe(loading => this.loadingDatosReporte = loading);
  }

  recargar(){
    if(this.tablaSuscripcionesComp) this.tablaSuscripcionesComp.cargarDatos();
    this.estadisticasSuscripcionesComp?.recargar();
  }

}
