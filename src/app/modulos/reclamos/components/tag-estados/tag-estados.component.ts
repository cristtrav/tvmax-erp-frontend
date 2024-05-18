import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag-estados',
  templateUrl: './tag-estados.component.html',
  styleUrls: ['./tag-estados.component.scss']
})
export class TagEstadosComponent {

  @Input()
  estado?: string;

  @Input()
  observacionEstado?: string;

  @Input()
  fullWidth: boolean = false;

  @Input()
  centeredText: boolean = false;

}
