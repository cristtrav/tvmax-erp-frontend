import { TestBed } from '@angular/core/testing';

import { HttpErrorResponseHandlerService } from './http-error-response-handler.service';

describe('HttpErrorResponseHandlerService', () => {
  let service: HttpErrorResponseHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpErrorResponseHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
