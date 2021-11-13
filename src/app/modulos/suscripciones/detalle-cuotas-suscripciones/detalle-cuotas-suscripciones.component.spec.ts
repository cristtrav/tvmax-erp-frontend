import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCuotasSuscripcionesComponent } from './detalle-cuotas-suscripciones.component';

describe('DetalleCuotasSuscripcionesComponent', () => {
  let component: DetalleCuotasSuscripcionesComponent;
  let fixture: ComponentFixture<DetalleCuotasSuscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCuotasSuscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCuotasSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
