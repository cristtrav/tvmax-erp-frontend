import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormCambioPasswordComponent } from './modulos/usuarios/form-cambio-password/form-cambio-password.component';
import { SesionService } from './servicios/sesion.service';
import { ISubmenu } from '@util/interfaces/isubmenu.interface';
import { AppSettings } from '@util/app-settings';
import { IMenuButton } from '@util/interfaces/imenu-button.interface';

interface IPreferenciaColorAvatar{
  idusuario: number;
  color: string;
}
const PREF_COLOR_AVATAR_KEY = "preferencias-color-avatar";
const COLORES_AVATAR_LIST: string[] = [
  "#D84315",
  "#EF6C00",
  "#FF8F00",
  "#9E9D24",
  "#558B2F",
  "#2E7D32",
  "#00695C",
  "#00838F",
  "#0277BD",
  "#1565C0",
  "#283593",
  "#4527A0",
  "#6A1B9A",
  "#AD1457",
  "#C62828"
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  @ViewChild(FormCambioPasswordComponent)
  formCambioPasswordComp!: FormCambioPasswordComponent; 

  isCollapsed = false;
  nombreUsuario: string = '';
  textoAvatar='';
  isCambiarPassModalVisible: boolean = false;
  guardarLoading: boolean = false;
  readonly mainMenu: ISubmenu[] = AppSettings.mainMenuStructure;
  colorAvatarUsuario: string = this.obtenerColorAleatorio();

  constructor(
    public sesionSrv: SesionService,
    private notif: NzNotificationService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.sesionSrv.nombreObs.subscribe((value)=>{
      this.nombreUsuario = value;
      this.textoAvatar = '';
      for(let n of value.split(' ')){
        this.textoAvatar += n.charAt(0).toUpperCase();
      }
    });
    this.cargarPreferenciasColorAvatar();
  }

  doLogout(): void {
    this.sesionSrv.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (e) => {
        console.error('Error al cerrar sesion', e);
        this.notif.create('error', 'Error al cerrar sesión', e.error);
      }
    });
  }

  subMenuVisible(menus: IMenuButton[]): boolean{    
    let visible: boolean = false;
    menus.forEach(menu => {
      visible = visible || this.sesionSrv.permisos.has(menu.id)
    })
    return visible;
  }

  private obtenerColorAleatorio(): string {
    return COLORES_AVATAR_LIST[Math.floor(Math.random() * COLORES_AVATAR_LIST.length)];
  }

  private cargarPreferenciasColorAvatar(){
    const preferenciasColor: IPreferenciaColorAvatar[] = JSON.parse(localStorage.getItem(PREF_COLOR_AVATAR_KEY) ?? '[]');
    let prefColorUsuario = preferenciasColor.find(pref => pref.idusuario == this.sesionSrv.idusuario);
    if(prefColorUsuario == null){
      prefColorUsuario = { idusuario: this.sesionSrv.idusuario, color: this.obtenerColorAleatorio() };
      preferenciasColor.push(prefColorUsuario);
      localStorage.setItem(PREF_COLOR_AVATAR_KEY, JSON.stringify(preferenciasColor));
    }
    this.colorAvatarUsuario = prefColorUsuario.color;
  }
}

