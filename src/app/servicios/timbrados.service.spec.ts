import { TestBed } from '@angular/core/testing';

import { TimbradosService } from './timbrados.service';

describe('TimbradosService', () => {
  let service: TimbradosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimbradosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
