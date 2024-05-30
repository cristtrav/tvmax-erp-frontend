import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuscripcionesRoutingModule } from './suscripciones-routing.module';
import { FormSuscripcionComponent } from './components/form-suscripcion/form-suscripcion.component';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { VistaSuscripcionesComponent } from './pages/vista-suscripciones/vista-suscripciones.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { DetalleSuscripcionComponent } from './pages/detalle-suscripcion/detalle-suscripcion.component';
import { CuotasSuscripcionesComponent } from './pages/cuotas-suscripciones/cuotas-suscripciones.component';
import { CuotasModule } from '../cuotas/cuotas.module';
import { DetalleCuotasSuscripcionesComponent } from './pages/detalle-cuotas-suscripciones/detalle-cuotas-suscripciones.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSliderModule} from 'ng-zorro-antd/slider';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { FormFiltroSuscripcionesComponent } from './components/form-filtro-suscripciones/form-filtro-suscripciones.component';
import { HelperComponentsModule } from '@helper-componets/helper-components.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { EstadisticasModule } from '../estadisticas/estadisticas.module';
import { ImpresionModule } from '../impresion/impresion.module';
import { PortalModule } from '@angular/cdk/portal'
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { OpenLocationCodePipe } from '@util/pipes/open-location-code.pipe';
import { DomiciliosModule } from '../domicilios/domicilios.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { ContenidoVistaSuscripcionesComponent } from './components/contenido-vista-suscripciones/contenido-vista-suscripciones.component';
import { TablaSuscripcionesComponent } from './components/tabla-suscripciones/tabla-suscripciones.component';

@NgModule({
  declarations: [
    ContenidoVistaSuscripcionesComponent,
    FormSuscripcionComponent,
    VistaSuscripcionesComponent,
    DetalleSuscripcionComponent,
    CuotasSuscripcionesComponent,
    DetalleCuotasSuscripcionesComponent,
    FormFiltroSuscripcionesComponent,
    TablaSuscripcionesComponent
  ],
  imports: [
    CommonModule,
    SuscripcionesRoutingModule,
    IconsProviderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzFormModule,
    NzInputNumberModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTagModule,
    NzPopconfirmModule,
    NzToolTipModule,
    NzSpinModule,
    NzBreadCrumbModule,
    CuotasModule,
    NzGridModule,
    NzBadgeModule,
    NzDrawerModule,
    NzSliderModule,
    NzTreeSelectModule,
    NzDescriptionsModule,
    HelperComponentsModule,
    NzTabsModule,
    EstadisticasModule,
    ImpresionModule,    
    PortalModule,
    NzModalModule,
    NzTypographyModule,
    OpenLocationCodePipe,
    DomiciliosModule,
    NzCollapseModule,
    WorkspaceLayoutModule,
    NzColResponsiveSizesDirective
  ],
  exports: [ContenidoVistaSuscripcionesComponent, FormSuscripcionComponent]
})
export class SuscripcionesModule { }
