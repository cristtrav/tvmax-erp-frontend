import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class AppSettings{
  public static get urlAPI(): string {
    if(environment.production) return `${location.protocol}//${location.hostname}:${location.port}/api`;
    else return `http://localhost:3000/api`;
    
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

  public static getHttpOptionsAuthWithParams(params: HttpParams): Object{
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }),
      params: params
    }
    return httpOptions;
  }

}
