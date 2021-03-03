import { TestBed } from '@angular/core/testing';

import { CobradoresService } from './cobradores.service';

describe('CobradoresService', () => {
  let service: CobradoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CobradoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
