import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResumenSuscripcionesDepartamentosComponent } from './tabla-resumen-suscripciones-departamentos.component';

describe('TablaResumenSuscripcionesDepartamentosComponent', () => {
  let component: TablaResumenSuscripcionesDepartamentosComponent;
  let fixture: ComponentFixture<TablaResumenSuscripcionesDepartamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResumenSuscripcionesDepartamentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaResumenSuscripcionesDepartamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
