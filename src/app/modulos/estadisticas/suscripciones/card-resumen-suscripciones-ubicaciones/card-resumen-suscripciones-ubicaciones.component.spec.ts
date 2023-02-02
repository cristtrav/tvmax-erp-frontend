import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResumenSuscripcionesUbicacionesComponent } from './card-resumen-suscripciones-ubicaciones.component';

describe('CardResumenSuscripcionesUbicacionesComponent', () => {
  let component: CardResumenSuscripcionesUbicacionesComponent;
  let fixture: ComponentFixture<CardResumenSuscripcionesUbicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardResumenSuscripcionesUbicacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardResumenSuscripcionesUbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
