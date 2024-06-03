import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { VentasRoutingModule } from './ventas-routing.module';
import { VistaVentasComponent } from './pages/vista-ventas/vista-ventas.component';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DetalleVentaComponent } from './pages/detalle-venta/detalle-venta.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzListModule } from 'ng-zorro-antd/list'; 
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormFiltrosVentasComponent } from './components/form-filtros-ventas/form-filtros-ventas.component';
import { TablaVentasComponent } from './components/tabla-ventas/tabla-ventas.component';
import { EstadisticasModule } from '../estadisticas/estadisticas.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { CuotasPendientesComponent } from './components/cuotas-pendientes/cuotas-pendientes.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { CobrosModule } from '../cobros/cobros.module';
import { HelperComponentsModule } from '@helper-componets/helper-components.module';
import { PaddingZerosPipe } from "../../global/pipes/padding-zeros.pipe";
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';

@NgModule({
    declarations: [
        VistaVentasComponent,
        DetalleVentaComponent,
        FormFiltrosVentasComponent,
        TablaVentasComponent,
        CuotasPendientesComponent,
        ServiciosComponent
    ],
    exports: [DetalleVentaComponent, FormFiltrosVentasComponent],
    imports: [
        CommonModule,
        VentasRoutingModule,
        NzBreadCrumbModule,
        IconsProviderModule,
        NzButtonModule,
        NzGridModule,
        NzInputModule,
        NzDatePickerModule,
        NzFormModule,
        NzSelectModule,
        NzInputNumberModule,
        NzAlertModule,
        NzDividerModule,
        NzTagModule,
        NzSpaceModule,
        NzToolTipModule,
        FormsModule,
        ReactiveFormsModule,
        NzSpinModule,
        NzTableModule,
        NzModalModule,
        NzDropDownModule,
        NzListModule,
        NzMenuModule,
        NzCollapseModule,
        NzTypographyModule,
        NzBadgeModule,
        NzPopconfirmModule,
        NzPopoverModule,
        NzNotificationModule,
        NzDrawerModule,
        NzCheckboxModule,
        NzTabsModule,
        EstadisticasModule,
        NzDescriptionsModule,
        CobrosModule,
        HelperComponentsModule,
        PaddingZerosPipe,
        WorkspaceLayoutModule,
        NzColResponsiveSizesDirective
    ]
})
export class VentasModule { }
