import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SesionService } from './servicios/sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isCollapsed = false;
  nombreUsuario: string = '';
  textoAvatar='';

  constructor(
    public sesionSrv: SesionService,
    private notif: NzNotificationService,
    private router: Router
  ){
    
  }
  ngOnInit(): void {
    this.sesionSrv.nombreObs.subscribe((value)=>{
      this.nombreUsuario = value;
      this.textoAvatar = '';
      for(let n of value.split(' ')){
        this.textoAvatar += n.charAt(0).toUpperCase();
      }
    });
  }

  doLogout(): void {
    this.sesionSrv.logout().subscribe(()=>{
      this.router.navigateByUrl('/login');
    }, (e)=>{
      console.log('Error al cerrar sesion');
      console.log(e);
      this.notif.create('error', 'Error al cerrar sesión', e.error);
    });
  }
}
