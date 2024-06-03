import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCuotasSuscripcionClienteComponent } from './detalle-cuotas-suscripcion-cliente.component';

describe('DetalleCuotasSuscripcionClienteComponent', () => {
  let component: DetalleCuotasSuscripcionClienteComponent;
  let fixture: ComponentFixture<DetalleCuotasSuscripcionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCuotasSuscripcionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCuotasSuscripcionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
