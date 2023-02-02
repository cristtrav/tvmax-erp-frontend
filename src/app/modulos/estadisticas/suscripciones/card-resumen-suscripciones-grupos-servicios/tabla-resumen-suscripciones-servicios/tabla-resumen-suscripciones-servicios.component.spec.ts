import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResumenSuscripcionesServiciosComponent } from './tabla-resumen-suscripciones-servicios.component';

describe('TablaResumenSuscripcionesServiciosComponent', () => {
  let component: TablaResumenSuscripcionesServiciosComponent;
  let fixture: ComponentFixture<TablaResumenSuscripcionesServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResumenSuscripcionesServiciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaResumenSuscripcionesServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
