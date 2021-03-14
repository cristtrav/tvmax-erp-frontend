import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuotasSuscripcionClienteComponent } from './cuotas-suscripcion-cliente.component';

describe('CuotasSuscripcionClienteComponent', () => {
  let component: CuotasSuscripcionClienteComponent;
  let fixture: ComponentFixture<CuotasSuscripcionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuotasSuscripcionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuotasSuscripcionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
