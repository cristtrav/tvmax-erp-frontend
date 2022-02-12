import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LugarTreeselectComponent } from './lugar-treeselect/lugar-treeselect.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { FormsModule } from '@angular/forms';
import { GrupoServicioTreeselectComponent } from './grupo-servicio-treeselect/grupo-servicio-treeselect.component';

@NgModule({
  declarations: [
    LugarTreeselectComponent,
    GrupoServicioTreeselectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzTreeSelectModule
  ],
  exports: [
    LugarTreeselectComponent, GrupoServicioTreeselectComponent
  ]
})
export class HelperComponentsModule { }
