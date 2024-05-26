import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaEstadisticasSuscripcionesComponent } from './vista-estadisticas-suscripciones.component';

describe('VistaEstadisticasSuscripcionesComponent', () => {
  let component: VistaEstadisticasSuscripcionesComponent;
  let fixture: ComponentFixture<VistaEstadisticasSuscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaEstadisticasSuscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaEstadisticasSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
