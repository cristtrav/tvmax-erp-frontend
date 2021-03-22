import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*import { clearTimeout } from 'node:timers';*/
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSettings } from './../util/app-settings';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private url = `${AppSettings.urlAPI}/session`;
  private idusuarioBehavior: BehaviorSubject<number> = new BehaviorSubject(-1);
  private nombreBehavior: BehaviorSubject<string> = new BehaviorSubject('(Sin usuario)');
  public idusuarioObs: Observable<number> =this.idusuarioBehavior.asObservable();
  public nombreObs: Observable<string> = this.nombreBehavior.asObservable();

  private refreshTokenTimeout: any;

  constructor(
    private http: HttpClient
  ) { 
  }

  public get idusuario(): number{
    return this.idusuarioBehavior.value;
  }

  public get nombre(): string{
    return this.nombreBehavior.value;
  }

  login(ci: string, pwd: string): Observable<{ accessToken: string, refreshToken: string }> {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.url}/login`, { ci: ci, password: pwd }, AppSettings.httpOptionsPostJson)
      .pipe(map((tokens: any) => {
        const atoken = tokens.accessToken;
        const rtoken = tokens.refreshToken;
        localStorage.setItem('accessToken', atoken);
        localStorage.setItem('refreshToken', rtoken);
        this.actualizarDatosUsuario(atoken);
        this.refreshTokenTimer(atoken);
        return tokens;
      }));
  }

  refresh(token: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.url}/refresh`, { refreshToken: token }, AppSettings.httpOptionsPostJson)
      .pipe(map((tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        this.actualizarDatosUsuario(tokens.accessToken);
        this.refreshTokenTimer(tokens.accessToken);
        return tokens;
      }), catchError(err => {
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        throw err
      }));
  }

  logout(): Observable<any>{
    this.stopRefreshTimer();
    const rtoken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.url}/logout`, {refreshToken: rtoken}, AppSettings.httpOptionsPost)
    .pipe(map(res=>{
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.idusuarioBehavior.next(-1);
      this.nombreBehavior.next('(Sin usuario)');
      return res;
    }));
  }

  private actualizarDatosUsuario(token: string): void {
    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    this.idusuarioBehavior.next(jwtToken.sub);
    this.nombreBehavior.next(jwtToken.name);
  }

  private refreshTokenTimer(token: string): void{
    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    const expiredate = new Date(jwtToken.exp * 1000);
    const timeout = expiredate.getTime() - (Date.now() - (60 * 1000));
    this.refreshTokenTimeout = setTimeout(()=>{
      console.log('Se actualiza el token');
      const rtoken = localStorage.getItem('refreshToken');
      if(rtoken){
        this.refresh(rtoken).subscribe();
      }
    }, timeout);
  }

  private stopRefreshTimer(){
    clearTimeout(this.refreshTokenTimeout);
  }
}
