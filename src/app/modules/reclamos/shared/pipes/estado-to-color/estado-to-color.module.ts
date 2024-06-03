import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoToColorPipe } from './estado-to-color.pipe';

@NgModule({
  declarations: [
    EstadoToColorPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [EstadoToColorPipe]
})
export class EstadoToColorModule { }
