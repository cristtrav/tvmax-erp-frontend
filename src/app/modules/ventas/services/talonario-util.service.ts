import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TalonarioUtilService {

  constructor() { }

  public guardarUltimoSeleccionado(idusuario: number, idtalonario: number | null) {
    if (typeof (Storage) === 'undefined') return;

    const clave: string = 'preferencias-detalle-venta';
    let preferencias: {
      idusuario: number,
      idUltimoTalonarioSeleccionado: number
    }[] = JSON.parse(localStorage.getItem('preferencias-detalle-venta') ?? '[]');

    preferencias = preferencias.filter(pref => pref.idusuario != idusuario);
    if (idtalonario) preferencias.push({ idusuario: idusuario, idUltimoTalonarioSeleccionado: idtalonario });

    localStorage.setItem(clave, JSON.stringify(preferencias));
  }

  public obtenerUltimoSeleccionado(idusuario: number): number | null {
    if (typeof (Storage) === 'undefined') return null
    const preferenciasStr: string = localStorage.getItem('preferencias-detalle-venta') ?? '[]';

    let preferencias: { idusuario: number, idUltimoTalonarioSeleccionado: number }[] = JSON.parse(preferenciasStr);
    const pref = preferencias.find(preferencia => preferencia.idusuario == idusuario);
    if(!pref) return null;
    return Number(pref.idUltimoTalonarioSeleccionado);
  }
}
