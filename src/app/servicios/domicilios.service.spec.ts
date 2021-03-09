import { TestBed } from '@angular/core/testing';

import { DomiciliosService } from './domicilios.service';

describe('DomiciliosService', () => {
  let service: DomiciliosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomiciliosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
