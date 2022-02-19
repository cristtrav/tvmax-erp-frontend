import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSuscripcionesResumenComponent } from './reporte-suscripciones-resumen.component';

describe('ReporteSuscripcionesResumenComponent', () => {
  let component: ReporteSuscripcionesResumenComponent;
  let fixture: ComponentFixture<ReporteSuscripcionesResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteSuscripcionesResumenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSuscripcionesResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
