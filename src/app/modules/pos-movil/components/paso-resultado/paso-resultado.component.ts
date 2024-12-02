import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-paso-resultado',
  templateUrl: './paso-resultado.component.html',
  styleUrls: ['./paso-resultado.component.scss']
})
export class PasoResultadoComponent {

  @Output()
  nuevoChange = new EventEmitter();

  nuevo(){
    this.nuevoChange.emit(true);
  }

}
