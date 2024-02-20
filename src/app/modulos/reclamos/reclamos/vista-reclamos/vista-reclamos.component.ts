import { Component } from '@angular/core';

@Component({
  selector: 'app-vista-reclamos',
  templateUrl: './vista-reclamos.component.html',
  styleUrls: ['./vista-reclamos.component.scss']
})
export class VistaReclamosComponent {

  textoBusqueda: string = '';

  limpiarBusqueda(){
    this.textoBusqueda = '';
  }

}
