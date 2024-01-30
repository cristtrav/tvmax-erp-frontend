import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientosMaterialesRoutingModule } from './movimientos-materiales-routing.module';
import { VistaMovimientosMaterialesComponent } from './vista-movimientos-materiales/vista-movimientos-materiales.component';
import { DetalleMovimientoMaterialComponent } from './detalle-movimiento-material/detalle-movimiento-material.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { TablaDetallesMovimientosComponent } from './detalle-movimiento-material/tabla-detalles-movimientos/tabla-detalles-movimientos.component';
import { BuscadorMaterialesComponent } from './detalle-movimiento-material/buscador-materiales/buscador-materiales.component';
import { FormFiltroMovimientosComponent } from './form-filtro-movimientos/form-filtro-movimientos.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzBadgeModule } from 'ng-zorro-antd/badge';


@NgModule({
  declarations: [
    VistaMovimientosMaterialesComponent,
    DetalleMovimientoMaterialComponent,
    TablaDetallesMovimientosComponent,
    BuscadorMaterialesComponent,
    FormFiltroMovimientosComponent
  ],
  imports: [
    CommonModule,
    MovimientosMaterialesRoutingModule,
    NzBreadCrumbModule,
    NzButtonModule,
    IconsProviderModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    FormsModule,
    NzDropDownModule,
    NzToolTipModule,
    NzEmptyModule,
    NzSpinModule,
    NzTagModule,
    NzSpaceModule,
    NzTypographyModule,
    NzTableModule,
    NzInputNumberModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzFormModule,
    NzTypographyModule,
    NzDescriptionsModule,
    NzRadioModule,
    NzDrawerModule,
    NzBadgeModule
  ]
})
export class MovimientosMaterialesModule { }
