import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutComponent } from './workspace-layout.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';

@NgModule({
  declarations: [WorkspaceLayoutComponent],
  imports: [
    CommonModule,
    NzGridModule,
    NzColResponsiveSizesDirective
  ],
  exports: [WorkspaceLayoutComponent]
})
export class WorkspaceLayoutModule { }
