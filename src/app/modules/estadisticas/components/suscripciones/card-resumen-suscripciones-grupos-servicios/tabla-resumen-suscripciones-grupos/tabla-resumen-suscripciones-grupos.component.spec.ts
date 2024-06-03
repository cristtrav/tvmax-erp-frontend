import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResumenSuscripcionesGruposComponent } from './tabla-resumen-suscripciones-grupos.component';

describe('TablaResumenSuscripcionesGruposComponent', () => {
  let component: TablaResumenSuscripcionesGruposComponent;
  let fixture: ComponentFixture<TablaResumenSuscripcionesGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResumenSuscripcionesGruposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaResumenSuscripcionesGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
