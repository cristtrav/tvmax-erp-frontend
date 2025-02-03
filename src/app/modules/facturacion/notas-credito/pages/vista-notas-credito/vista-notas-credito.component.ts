import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { TablaNotasCreditoComponent } from '../../components/tabla-notas-credito/tabla-notas-credito.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-vista-notas-credito',
  templateUrl: './vista-notas-credito.component.html',
  styleUrls: ['./vista-notas-credito.component.scss']
})
export class VistaNotasCreditoComponent implements OnInit {

  @ViewChild(TablaNotasCreditoComponent)
  tablaNotasCreditoComp!: TablaNotasCreditoComponent;

  constructor(){}

  ngOnInit(): void {
  }

  cargarDatos(){
    this.tablaNotasCreditoComp.cargarDatos();
  }
  
}
