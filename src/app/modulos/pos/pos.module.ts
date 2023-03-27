import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosRoutingModule } from './pos-routing.module';
import { VentasModule } from '../ventas/ventas.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PosRoutingModule,
    VentasModule
  ]
})
export class PosModule { }
