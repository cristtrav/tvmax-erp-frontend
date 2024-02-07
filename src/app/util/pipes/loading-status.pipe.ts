import { Pipe, PipeTransform } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';

@Pipe({
  name: 'loadingStatus',
  standalone: true
})
export class LoadingStatusPipe implements PipeTransform {

  constructor(){ }
  
  transform<Type = any>(value: Observable<Type>): Observable<LoadingStatusInterface<Type>> {
      return value.pipe(
        map(val => {
          return { loading: false, value: val }
        }),
        startWith({loading: true}),
        catchError(() => of({loading: false}))
      );
  }

}

export interface LoadingStatusInterface<Type>{
  value?: Type,
  loading: boolean
}