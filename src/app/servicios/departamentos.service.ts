import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient } from '@angular/common/http';
import { Departamento } from '../dto/departamento-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  url = `${AppSettings.urlAPI}/departamentos`;

  constructor(private http: HttpClient) { }

  post(d: Departamento): Observable<any>{
    return this.http.post(this.url, d, AppSettings.httpOptionsPost);
  }

  get(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.url);
  }

  getPorId(id: string): Observable<Departamento>{
    return this.http.get<Departamento>(`${this.url}/${id}`);
  }

  put(d: Departamento): Observable<any>{
    return this.http.put(`${this.url}/${d.id}`, d, AppSettings.httpOptionsPost);
  }

  delete(id: string | null): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }
}
