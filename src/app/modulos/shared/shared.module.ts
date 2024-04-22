import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { WorkspaceComponent } from './workspace/workspace.component';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';

@NgModule({
  declarations: [
    WorkspaceComponent
  ],
  imports: [
    CommonModule,
    NzGridModule,
    NzColResponsiveSizesDirective
  ],
  exports: [WorkspaceComponent]
})
export class SharedModule { }
