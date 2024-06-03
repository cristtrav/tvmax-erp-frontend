import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatosFacturasRoutingModule } from './formatos-facturas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { ImpresionModule } from '../impresion/impresion.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { VistaFormatosFacturasComponent } from './pages/vista-formatos-facturas/vista-formatos-facturas.component';
import { DetalleFormatoFacturaComponent } from './pages/detalle-formato-factura/detalle-formato-factura.component';
import { FormularioFormatoPreAComponent } from './components/formulario-formato-pre-a/formulario-formato-pre-a.component';


@NgModule({
  declarations: [
    VistaFormatosFacturasComponent,
    DetalleFormatoFacturaComponent,
    FormularioFormatoPreAComponent
  ],
  imports: [
    CommonModule,
    FormatosFacturasRoutingModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzGridModule,
    ImpresionModule,
    NzFormModule,
    NzInputModule,
    NzCollapseModule,
    NzDividerModule,
    NzInputNumberModule,
    FormsModule,
    NzSpinModule,
    NzModalModule,
    WorkspaceLayoutModule
  ]
})
export class FormatosFacturasModule { }
