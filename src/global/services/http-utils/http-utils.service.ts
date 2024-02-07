import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { Observable, catchError } from 'rxjs';

@Injectable({providedIn: 'root'})

export class HttpUtilsService {

    constructor(
        private http: HttpClient,
        private httpErrorHandler: HttpErrorResponseHandlerService
    ) { }

    appendCatchError<T>(obs: Observable<T>): Observable<T>{
        return obs.pipe(
            catchError((e) => {
              this.httpErrorHandler.process(e);
              throw e;
            })
        );
    }

    get<T = any>(url: string, options: {[name: string]: any}): Observable<T>{
        return this.appendCatchError(this.http.get<T>(url, options));
    }

    post<T = any>(url: string, body: any, options: {[name: string]: any}): Observable<T>{
        return this.appendCatchError(this.http.post<T>(url, body, options));
    }

    put<T = any>(url: string, body: any, options: {[name: string]: any}): Observable<T>{
        return this.appendCatchError(this.http.put<T>(url, body, options));
    }

    delete<T = any>(url: string, options: {[name: string]: any}): Observable<T>{
        return this.appendCatchError(this.http.delete<T>(url, options));
    }
    
}