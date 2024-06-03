import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoToDescriptionPipe } from './estado-to-description.pipe';

@NgModule({
  declarations: [
    EstadoToDescriptionPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [EstadoToDescriptionPipe]
})
export class EstadoToDescriptionModule { }
