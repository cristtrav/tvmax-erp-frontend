import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaDomiciliosComponent } from './vista-domicilios/vista-domicilios.component';

const routes: Routes = [
  { path: '', component: VistaDomiciliosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomiciliosRoutingModule { }
