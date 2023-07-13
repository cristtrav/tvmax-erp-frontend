import { Component, OnInit } from '@angular/core';
import { SesionService } from '@servicios/sesion.service';
import { AppSettings } from '@util/app-settings';

@Component({
  selector: 'app-vista-dashboard',
  templateUrl: './vista-dashboard.component.html',
  styleUrls: ['./vista-dashboard.component.scss']
})
export class VistaDashboardComponent implements OnInit {

  nombreUsuario: string = '(Sin usuario)';
  mapButton = AppSettings.mapIdButton;
  mapSubmenu = AppSettings.mapButtonSubmenu;

  constructor(
    public sesionSrv: SesionService
  ) { }

  ngOnInit(): void {
    this.sesionSrv.nombreObs.subscribe(value => this.nombreUsuario = value);
  }

}
