import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutComponent } from './workspace-layout.component';

@NgModule({
  declarations: [WorkspaceLayoutComponent],
  imports: [
    CommonModule
  ],
  exports: [WorkspaceLayoutComponent]
})
export class WorkspaceLayoutModule { }
