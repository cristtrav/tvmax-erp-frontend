import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from '../dto/usuario-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = `${AppSettings.urlAPI}/usuarios`;

  constructor(
    private http: HttpClient
  ) { }

  post(u: Usuario): Observable<any> {
    return this.http.post(this.url, u, AppSettings.httpOptionsPost);
  }

  get(filters: Array<{ key: string, value: any | null }>): Observable<Usuario[]> {
    let params: HttpParams = new HttpParams()
      .append('eliminado', 'false');
    for (let f of filters) {
      params = params.append(f.key, `${f.value}`);
    }
    return this.http.get<Usuario[]>(this.url, { params });
  }

  getPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  put(id: number, u: Usuario): Observable<any> {
    return this.http.put(`${this.url}/${id}`, u, AppSettings.httpOptionsPost);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
