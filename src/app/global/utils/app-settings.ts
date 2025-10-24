import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ISubmenu } from '../interfaces/isubmenu.interface';
import { IMenuButton } from '../interfaces/imenu-button.interface';

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
          id: 1180,
          name: 'POS Móvil',
          routerLink: '/app/posmovil'
        },
        /*{
          id: 244,
          name: 'Talonarios',
          routerLink: '/app/talonarios',
        },*/
        {
          id: 1300,
          name: 'Notas de crédito',
          routerLink: '/app/notascredito'
        },
        {
          id: 1360,
          name: 'Timbrados',
          routerLink: '/app/timbrados'
        },
        {
          id: 1220,
          name: 'Lotes SIFEN',
          routerLink: '/app/lotesfacturas'
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
        },
        {
          id: 206,
          name: 'Domicilios',
          routerLink: '/app/domicilios'
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
      title: "Depósitos",
      icon: "inbox",
      children: [
        {
          id: 600,
          name: 'Grupos',
          routerLink: '/app/gruposmateriales'
        },
        {
          id: 680,
          name: 'Materiales',
          routerLink: '/app/materiales'
        },
        {
          id: 640,
          name: 'Movimientos',
          routerLink: '/app/movimientosmateriales'
        },
        {
          id: 720,
          name: 'Usuarios',
          routerLink: '/app/usuariosdepositos'
        }
      ]
    },
    {
      id: 7,
      title: 'Promociones',
      icon: 'gift',
      children: [
        {
          id: 400,
          name: 'Sorteos',
          routerLink: '/app/sorteos'
        }
      ]
    },
    {
      id: 8,
      title: 'Reclamos',
      icon: 'notification',
      children: [
        {
          id: 760,
          name: 'Motivos',
          routerLink: '/app/motivosreclamos',
          queryParams: {orden: 'descend', ordenarPor: 'id', pagina: '1', nroRegistros: '10'}
        },
        {
          id: 800,
          name: 'Reclamos',
          routerLink: '/app/reclamos'
        },
        {
          id: 880,
          name: 'Asignaciones',
          routerLink: '/app/asignacionesreclamos'
        }
      ]
    },
    {
      id: 9,
      title: 'Tributación',
      icon: 'percentage',
      children: [
        {
          id: 1060,
          name: 'Act. Económicas',
          routerLink: '/app/actividadeseconomicas'
        },
        {
          id: 1020,
          name: "Contribuyente",
          routerLink: '/app/contribuyente'
        },
        {
          id: 1140,
          name: 'CSC',
          routerLink: '/app/csc'
        },
        {
          id: 1100,
          name: 'Establecimientos',
          routerLink: '/app/establecimientos'
        },
        {
          id: 980,
          name: 'Exportar CSV',
          routerLink: '/app/exportarcsv'
        }
      ]
    },
    {
      id: 9,
      title: 'Extras',
      icon: 'control',
      children: [
        {
          id: 321,
          name: 'Eventos del sistema',
          routerLink: '/app/auditoria',
        },
        {
          id: 344,
          name: 'Formatos de facturas',
          routerLink: '/app/formatosfacturas',
        },
        {
          id: 1460,
          name: 'Generar DTE en Lotes',
          routerLink: '/app/generar-dte-lotes'
        },
        
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

  public static getHttpOptionsBlobAuthWithParams(params: HttpParams): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }),
      responseType: 'blob',
      params: params
    }
    return httpOptions;
  }

  public static getHttpOptionsBlobAuth(): Object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }),
      responseType: 'blob'
    }
    return httpOptions;
  }

}
