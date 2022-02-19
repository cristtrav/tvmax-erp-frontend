import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSuscripcionesListaComponent } from './reporte-suscripciones-lista.component';

describe('ReporteSuscripcionesListaComponent', () => {
  let component: ReporteSuscripcionesListaComponent;
  let fixture: ComponentFixture<ReporteSuscripcionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteSuscripcionesListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSuscripcionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
