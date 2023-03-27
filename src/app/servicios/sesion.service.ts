import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Funcionalidad } from '@dto/funcionalidad-dto';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
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
  permisos = new Set<number>();

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

  private getPermisosUsuario(idusuario: number): Observable<Funcionalidad[]>{
    const params = new HttpParams().append('eliminado', 'false');
    return this.http.get<Funcionalidad[]>(`${this.url}/permisos/${idusuario}`, { params });
  }

  login(ci: string, pwd: string): Observable<ISession> {
    return this.http.post<ISession>(`${this.url}/login`, { ci: ci, password: pwd }, AppSettings.httpOptionsPostJson)
      .pipe(
        mergeMap(ses => forkJoin({
          permisos: this.getPermisosUsuario(this.getIdUsuario(ses.accessToken)),
          session: of(ses)
        })),
        map(resp => {
          console.log(resp.permisos);
          for(let permiso of resp.permisos){
            this.permisos.add(permiso.id ?? -1);
          }
          const atoken = resp.session.accessToken;
          const rtoken = resp.session.refreshToken;
          this.nombreBehavior.next(resp.session.nombreUsuario);
          localStorage.setItem('accessToken', atoken);
          localStorage.setItem('refreshToken', rtoken);
          this.actualizarDatosUsuario(atoken);
          this.refreshTokenTimer(atoken);
          return (<ISession>resp.session);
        })
      );
    /*return this.http.post<ISession>(`${this.url}/login`, { ci: ci, password: pwd }, AppSettings.httpOptionsPostJson)
      .pipe(
        mergeMap(sess=> {
          return sess;
        }),
        map((session: any) => {
          const atoken = session.accessToken;
          const rtoken = session.refreshToken;
          this.nombreBehavior.next(session.nombreUsuario);
          localStorage.setItem('accessToken', atoken);
          localStorage.setItem('refreshToken', rtoken);
          this.actualizarDatosUsuario(atoken);
          this.refreshTokenTimer(atoken);
          return session;
      }));*/
  }

  refresh(token: string): Observable<IRefreshSession> {
    return this.http.post<IRefreshSession>(`${this.url}/refresh`, { refreshToken: token }, AppSettings.httpOptionsPostJson)
      .pipe(
        mergeMap(ses => forkJoin({
          permisos: this.getPermisosUsuario(this.getIdUsuario(ses.accessToken)),
          session: of(ses)
        })),
        map((resp) => {
          this.permisos.clear();
          for(let permiso of resp.permisos){
            this.permisos.add(permiso.id ?? -1);
          }
          localStorage.setItem('accessToken', resp.session.accessToken);
          this.nombreBehavior.next(resp.session.nombreUsuario);
          this.actualizarDatosUsuario(resp.session.accessToken);
          this.refreshTokenTimer(resp.session.accessToken);
          return (<IRefreshSession>resp.session);
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
      .pipe(
        map(res => {
          this.permisos.clear();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.idusuarioBehavior.next(-1);
          this.nombreBehavior.next('(Sin usuario)');
          return res;
        }));
  }

  private actualizarDatosUsuario(token: string): void {
    const jwtToken = JSON.parse(window.atob(token.split('.')[1]));
    this.idusuarioBehavior.next(jwtToken.sub);
  }

  private getIdUsuario(token: string): number {
    const jwtToken = JSON.parse(window.atob(token.split('.')[1]));
    return jwtToken.sub;
  }

  private refreshTokenTimer(token: string): void {
    const jwtToken = JSON.parse(window.atob(token.split('.')[1]));
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