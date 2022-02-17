import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResumenSuscripcionesDepartDistritoComponent } from './card-resumen-suscripciones-depart-distrito.component';

describe('CardResumenSuscripcionesDepartCiudadComponent', () => {
  let component: CardResumenSuscripcionesDepartDistritoComponent;
  let fixture: ComponentFixture<CardResumenSuscripcionesDepartDistritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardResumenSuscripcionesDepartDistritoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardResumenSuscripcionesDepartDistritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
