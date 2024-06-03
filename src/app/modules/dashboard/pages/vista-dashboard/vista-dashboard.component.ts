import { Component, HostListener, OnInit } from '@angular/core';
import { SesionService } from '@services/sesion.service';
import { AppSettings } from '@global-utils/app-settings';

@Component({
  selector: 'app-vista-dashboard',
  templateUrl: './vista-dashboard.component.html',
  styleUrls: ['./vista-dashboard.component.scss']
})
export class VistaDashboardComponent implements OnInit {

  cardSize: 'default' | 'small' = 'default';
  showCardReclamos: boolean = false;

  nombreUsuario: string = '(Sin usuario)';
  mapButton = AppSettings.mapIdButton;
  mapSubmenu = AppSettings.mapButtonSubmenu;

  constructor(
    public sesionSrv: SesionService
  ) { }

  ngOnInit(): void {
    this.onWindowResize();
    this.sesionSrv.nombreObs.subscribe(value => this.nombreUsuario = value);
  }

  @HostListener('window:resize')
  onWindowResize(){
    if(window.innerWidth >= 576) this.cardSize = 'default';
    else this.cardSize = 'small';
  }

  isFavMessageVisible(idFuncionalidadFavs: number[] | null) : boolean{
    if(idFuncionalidadFavs == null) return true;
    for(let idfav of idFuncionalidadFavs){
      if(this.sesionSrv.permisos.has(idfav)) return false;
    }
  return true;
  }

}
