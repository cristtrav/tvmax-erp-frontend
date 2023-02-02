import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResumenSuscripcionesDistritosComponent } from './tabla-resumen-suscripciones-distritos.component';

describe('TablaResumenSuscripcionesDistritosComponent', () => {
  let component: TablaResumenSuscripcionesDistritosComponent;
  let fixture: ComponentFixture<TablaResumenSuscripcionesDistritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResumenSuscripcionesDistritosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaResumenSuscripcionesDistritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
