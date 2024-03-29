import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { VistaClientesComponent } from './vista-clientes/vista-clientes.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { DomiciliosClienteComponent } from './domicilios-cliente/domicilios-cliente.component';
import { DomiciliosModule } from './../domicilios/domicilios.module';
import { DetalleDomicilioClienteComponent } from './detalle-domicilio-cliente/detalle-domicilio-cliente.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SuscripcionesClienteComponent } from './suscripciones-cliente/suscripciones-cliente.component';
import { DetalleSuscripcionClienteComponent } from './detalle-suscripcion-cliente/detalle-suscripcion-cliente.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SuscripcionesModule } from './../suscripciones/suscripciones.module';
import { CuotasSuscripcionClienteComponent } from './cuotas-suscripcion-cliente/cuotas-suscripcion-cliente.component';
import { CuotasModule } from './../cuotas/cuotas.module';
import { DetalleCuotasSuscripcionClienteComponent } from './detalle-cuotas-suscripcion-cliente/detalle-cuotas-suscripcion-cliente.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { FormFiltroClientesComponent } from './form-filtro-clientes/form-filtro-clientes.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { HelperComponentsModule } from '@helper-componets/helper-components.module';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { PagosClienteComponent } from './pagos-cliente/pagos-cliente.component';
import { CobrosModule } from "../cobros/cobros.module";
import { VentasModule } from '../ventas/ventas.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { OpenLocationCodePipe } from '@util/pipes/open-location-code.pipe';

@NgModule({
    declarations: [VistaClientesComponent, DetalleClienteComponent, DomiciliosClienteComponent, DetalleDomicilioClienteComponent, SuscripcionesClienteComponent, DetalleSuscripcionClienteComponent, CuotasSuscripcionClienteComponent, DetalleCuotasSuscripcionClienteComponent, FormFiltroClientesComponent, PagosClienteComponent],
    imports: [
        CommonModule,
        ClientesRoutingModule,
        IconsProviderModule,
        NzButtonModule,
        NzGridModule,
        NzTableModule,
        NzFormModule,
        NzInputModule,
        NzInputNumberModule,
        FormsModule,
        ReactiveFormsModule,
        NzPopconfirmModule,
        NzDividerModule,
        NzSelectModule,
        NzBreadCrumbModule,
        NzNotificationModule,
        NzSpaceModule,
        DomiciliosModule,
        NzToolTipModule,
        NzTagModule,
        SuscripcionesModule,
        CuotasModule,
        NzSpinModule,
        NzBadgeModule,
        NzDrawerModule,
        NzDescriptionsModule,
        HelperComponentsModule,
        NzTypographyModule,
        NzModalModule,
        NzDropDownModule,
        CobrosModule,
        VentasModule,
        NzTabsModule,
        NzCollapseModule,
        OpenLocationCodePipe
    ]
})
export class ClientesModule { }
