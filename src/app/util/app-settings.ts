import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ISubmenu } from './interfaces/isubmenu.interface';
import { IMenuButton } from './interfaces/imenu-button.interface';

export class AppSettings {

  public static readonly mainMenuStructure: ISubmenu[] = [
    {
      id: 1,
      title: 'Clientes',
      icon: 'user',      
      children: [
        {
          id: 184,
          name: 'Clientes',
          routerLink: '/app/clientes',
        },
        {
          id: 165,
          name: 'Suscripciones',
          routerLink: '/app/suscripciones',
        }
      ]
    },
    {
      id: 2,
      title: 'Facturación',
      icon: 'file-done',
      children: [
        {
          id: 266,
          name: 'Ventas',
          routerLink: '/app/ventas',
        },
        {
          id: 380,
          name: 'POS',
          routerLink: '/app/pos',
        },
        {
          id: 244,
          name: 'Timbrados',
          routerLink: '/app/timbrados',
        }
      ]
    },
    {
      id: 3,
      title: 'Funcionarios',
      icon: 'team',
      children: [
        {
          id: 124,
          name: 'Usuarios',
          routerLink: '/app/usuarios',
        },
        {
          id: 144,
          name: 'Roles',
          routerLink: '/app/roles',
        }
      ]
    },
    {
      id: 4,
      title: 'Lugares',
      icon: 'global',
      children: [
        {
          id: 44,
          name: 'Departamentos',
          routerLink: '/app/departamentos',
        },
        {
          id: 64,
          name: 'Distritos',
          routerLink: '/app/distritos',
        },
        {
          id: 84,
          name: 'Barrios',
          routerLink: '/app/barrios',
        }
      ]
    },
    {
      id: 5,
      title: 'Servicios',
      icon: 'shopping',
      children: [
        {
          id: 5,
          name: 'Grupos',
          routerLink: '/app/grupos',
        },
        {
          id: 24,
          name: 'Servicios',
          routerLink: '/app/servicios',
        }
      ]
    },
    {
      id: 6,
      title: 'Ajustes de impresión',
      icon: 'printer',
      children: [
        {
          id: 344,
          name: 'Formatos de facturas',
          routerLink: '/app/formatosfacturas',
        }
      ]
    },
    {
      id: 7,
      title: 'Auditoría',
      icon: 'audit',
      children: [
        {
          id: 321,
          name: 'Eventos',
          routerLink: '/app/auditoria',
        }
      ]
    }
  ]

  public static readonly mapButtonSubmenu = new Map<number, ISubmenu>();
  public static readonly mapIdButton = new Map<number, IMenuButton>();

  static {
    AppSettings.mainMenuStructure.forEach(submenu => {
      submenu.children.forEach(button => {
        AppSettings.mapButtonSubmenu.set(button.id, submenu);
        AppSettings.mapIdButton.set(button.id, button);
      })
    })
  }

  public static get urlAPI(): string {
    return `${location.protocol}//${location.hostname}:${location.port}/api`;
  }

  public static get httpOptionsPost(): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
      responseType: 'text'
    }
    return httpOptions;
  }
  public static get httpOptions(): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      })
    }
    return httpOptions;
  }
  public static get httpOptionsPostJson(): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
      responseType: 'json'
    }
    return httpOptions;
  }

  public static getHttpOptionsJsonTextAuth(): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }),
      responseType: 'text'
    }
    return httpOptions;
  }

  public static getHttpOptionsTextAuth(): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }),
      responseType: 'text'
    }
    return httpOptions;
  }

  public static get headersGetAuth(): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      })
    }
    return httpOptions;
  }

  public static getHttpOptionsAuth(): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      })
    }
    return httpOptions;
  }

  public static getHttpOptionsAuthWithParams(params: HttpParams): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }),
      params: params
    }
    return httpOptions;
  }

}
