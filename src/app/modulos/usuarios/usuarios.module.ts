import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { VistaUsuariosComponent } from './vista-usuarios/vista-usuarios.component';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { PermisosUsuarioComponent } from './permisos-usuario/permisos-usuario.component';
import { NzTreeModule} from 'ng-zorro-antd/tree';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormCambioPasswordComponent } from './form-cambio-password/form-cambio-password.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { RolesUsuarioComponent } from './roles-usuario/roles-usuario.component';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';

@NgModule({
  declarations: [
    VistaUsuariosComponent,
    DetalleUsuarioComponent,
    PermisosUsuarioComponent,
    FormCambioPasswordComponent,
    RolesUsuarioComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzButtonModule,
    IconsProviderModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    NzDividerModule,
    NzCheckboxModule,
    NzNotificationModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzToolTipModule,
    NzSpaceModule,
    NzTreeModule,
    NzTypographyModule,
    NzTagModule,
    NzDescriptionsModule,
    NzSelectModule,
    NzModalModule,
    NzAlertModule,
    NzListModule,
    NzEmptyModule,
    NzCheckboxModule,
    WorkspaceLayoutModule,
    NzColResponsiveSizesDirective
  ],
  exports: [FormCambioPasswordComponent]
})
export class UsuariosModule { }
