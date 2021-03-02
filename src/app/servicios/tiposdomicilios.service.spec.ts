import { TestBed } from '@angular/core/testing';

import { TiposdomiciliosService } from './tiposdomicilios.service';

describe('TiposdomiciliosService', () => {
  let service: TiposdomiciliosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposdomiciliosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
