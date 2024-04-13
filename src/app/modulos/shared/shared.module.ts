import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content/content.component';
import { NzGridModule } from 'ng-zorro-antd/grid';



@NgModule({
  declarations: [
    ContentComponent
  ],
  imports: [
    CommonModule,
    NzGridModule
  ]
})
export class SharedModule { }
