import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResumenSuscripcionesBarriosComponent } from './tabla-resumen-suscripciones-barrios.component';

describe('TablaResumenSuscripcionesBarriosComponent', () => {
  let component: TablaResumenSuscripcionesBarriosComponent;
  let fixture: ComponentFixture<TablaResumenSuscripcionesBarriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResumenSuscripcionesBarriosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaResumenSuscripcionesBarriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
