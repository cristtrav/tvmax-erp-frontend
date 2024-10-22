import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpUtilsService } from './http-utils/http-utils.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartamentoSifenDTO } from '@dto/departamento-sifen.dto';
import { AppSettings } from '@util/app-settings';
import { DistritoSifenDTO } from '@dto/distrito-sifen.dto';
import { CiudadSifenDTO } from '@dto/ciudad-sifen.dto';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesSifenService {

  url: string = `${environment.apiURL}/ubicacionessifen`;

  constructor(
    private httUtils: HttpUtilsService
  ) { }

  findAllDepartamentos(params: HttpParams): Observable<DepartamentoSifenDTO[]>{
    return this.httUtils.get(`${this.url}/departamentos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  findDistritosByDepartamento(codDepartamento: number): Observable<DistritoSifenDTO[]>{
    return this.httUtils.get(`${this.url}/departamentos/${codDepartamento}/distritos`, AppSettings.getHttpOptionsAuth());
  }

  findCiudadesByDistrito(codDistrito: number): Observable<CiudadSifenDTO[]>{
    return this.httUtils.get(`${this.url}/distritos/${codDistrito}/ciudades`, AppSettings.getHttpOptionsAuth());
  }
  
}
