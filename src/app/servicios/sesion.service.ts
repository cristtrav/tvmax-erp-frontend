import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
/*import { clearTimeout } from 'node:timers';*/
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSettings } from '../util/app-settings';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private url = `${AppSettings.urlAPI}/sesion`;
  private idusuarioBehavior: BehaviorSubject<number> = new BehaviorSubject(-1);
  private nombreBehavior: BehaviorSubject<string> = new BehaviorSubject('(Sin usuario)');
  public idusuarioObs: Observable<number> = this.idusuarioBehavior.asObservable();
  public nombreObs: Observable<string> = this.nombreBehavior.asObservable();

  private refreshTokenTimeout: any;
  private checkServerTimeout: any;
  serverOnline: boolean = true;
  private modalNotifOffline!: NzModalRef | null;

  constructor(
    private http: HttpClient,
    private modal: NzModalService,
    private router: Router
  ) { }


  public get idusuario(): number {
    return this.idusuarioBehavior.value;
  }

  public get nombre(): string {
    return this.nombreBehavior.value;
  }

  login(ci: string, pwd: string): Observable<ISession> {
    return this.http.post<ISession>(`${this.url}/login`, { ci: ci, password: pwd }, AppSettings.httpOptionsPostJson)
      .pipe(map((session: any) => {
        const atoken = session.accessToken;
        const rtoken = session.refreshToken;
        this.nombreBehavior.next(session.nombreUsuario);
        localStorage.setItem('accessToken', atoken);
        localStorage.setItem('refreshToken', rtoken);
        this.actualizarDatosUsuario(atoken);
        this.refreshTokenTimer(atoken);
        return session;
      }));
  }

  refresh(token: string): Observable<IRefreshSession> {
    return this.http.post<IRefreshSession>(`${this.url}/refresh`, { refreshToken: token }, AppSettings.httpOptionsPostJson)
      .pipe(map((session) => {
        localStorage.setItem('accessToken', session.accessToken);
        this.nombreBehavior.next(session.nombreUsuario);
        this.actualizarDatosUsuario(session.accessToken);
        this.refreshTokenTimer(session.accessToken);
        return session;
      }), catchError(err => {
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        throw err
      }));
  }

  logout(): Observable<any> {
    this.stopRefreshTimer();
    const rtoken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.url}/logout`, { refreshToken: rtoken }, AppSettings.httpOptionsPost)
      .pipe(map(res => {
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
  }

  private refreshTokenTimer(token: string): void {
    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    const expiredate = new Date(jwtToken.exp * 1000);
    const timeout = (expiredate.getTime() - Date.now()) - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => {
      console.log('Se actualiza el token');
      const rtoken = localStorage.getItem('refreshToken');
      if (rtoken) {
        this.refresh(rtoken).subscribe();
      }
    }, timeout);
  }

  private stopRefreshTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  checkServer() {
    this.http.get(`${AppSettings.urlAPI}`, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Server online!', response);
        const refreshToken = localStorage.getItem('refreshToken');
        if (!this.serverOnline && refreshToken) this.refresh(refreshToken).subscribe();
        this.serverOnline = true;
        this.checkServerTimer(10000);
        this.modalNotifOffline?.close();
        this.modalNotifOffline = null;
      },
      error: (e) => {
        console.log('Server offline :(');
        this.checkServerTimer(3000);
        this.serverOnline = false;
        if (!this.modalNotifOffline && this.router.url !== '/' && this.router.url !== '/login')
          this.modalNotifOffline = this.modal.info({
            nzTitle: 'Conexión perdida',
            nzContent: 'Intentando reconectar con el servidor...',
            nzClosable: false,
            nzOkLoading: true,
            nzOkText: 'Conectando'
          });
      }
    })
  }

  private checkServerTimer(millis: number) {
    clearTimeout(this.checkServerTimeout)
    setTimeout(() => {
      this.checkServer();
    }, millis);
  }
}

interface ISession {
  accessToken: string,
  refreshToken: string,
  nombreUsuario: string
}

interface IRefreshSession {
  accessToken: string,
  nombreUsuario: string
}