import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoEstadisticasSuscripcionesComponent } from './contenido-estadisticas-suscripciones.component';

describe('ContenidoEstadisticasSuscripcionesComponent', () => {
  let component: ContenidoEstadisticasSuscripcionesComponent;
  let fixture: ComponentFixture<ContenidoEstadisticasSuscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContenidoEstadisticasSuscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenidoEstadisticasSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
