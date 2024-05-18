import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagEstadosComponent } from './tag-estados.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { EstadoToDescriptionModule } from '../../pipes/estado-to-description/estado-to-description.module';
import { EstadoToColorModule } from '../../pipes/estado-to-color/estado-to-color.module';

@NgModule({
  declarations: [
    TagEstadosComponent
  ],
  imports: [
    CommonModule,
    NzTagModule,
    EstadoToDescriptionModule,
    EstadoToColorModule
  ],
  exports: [TagEstadosComponent]
})
export class TagEstadosModule { }
