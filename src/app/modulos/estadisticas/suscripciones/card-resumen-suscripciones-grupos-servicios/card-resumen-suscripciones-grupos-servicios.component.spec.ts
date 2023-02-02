import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResumenSuscripcionesGruposServiciosComponent } from './card-resumen-suscripciones-grupos-servicios.component';

describe('CardResumenSuscripcionesGruposComponent', () => {
  let component: CardResumenSuscripcionesGruposServiciosComponent;
  let fixture: ComponentFixture<CardResumenSuscripcionesGruposServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardResumenSuscripcionesGruposServiciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardResumenSuscripcionesGruposServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
