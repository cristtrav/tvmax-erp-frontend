import { HttpHeaders, HttpParams } from '@angular/common/http';

export class AppSettings{
  public static get urlAPI(): string {
    const hostname = window.location.hostname;
    return `http://${hostname}:3000/api`;
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
}
