import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimbradoUtilService {

  constructor() { }

  public guardarUltimoSeleccionado(idusuario: number, idtimbrado: number | null) {
    if (typeof (Storage) === 'undefined') return;

    const clave: string = 'preferencias-detalle-venta';
    let preferencias: {
      idusuario: number,
      idUltimoTimbradoSeleccionado: number
    }[] = JSON.parse(localStorage.getItem('preferencias-detalle-venta') ?? '[]');

    preferencias = preferencias.filter(pref => pref.idusuario != idusuario);
    if (idtimbrado) preferencias.push({ idusuario: idusuario, idUltimoTimbradoSeleccionado: idtimbrado });

    localStorage.setItem(clave, JSON.stringify(preferencias));
  }

  public obtenerUltimoSeleccionado(idusuario: number): number | null {
    if (typeof (Storage) === 'undefined') return null
    const preferenciasStr: string = localStorage.getItem('preferencias-detalle-venta') ?? '[]';

    let preferencias: { idusuario: number, idUltimoTimbradoSeleccionado: number }[] = JSON.parse(preferenciasStr);
    const pref = preferencias.find(preferencia => preferencia.idusuario == idusuario);
    if(!pref) return null;
    return Number(pref.idUltimoTimbradoSeleccionado);
  }
}
