import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMovimientoMaterialComponent } from './reporte-movimiento-material.component';

describe('ReporteMovimientoMaterialComponent', () => {
  let component: ReporteMovimientoMaterialComponent;
  let fixture: ComponentFixture<ReporteMovimientoMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteMovimientoMaterialComponent]
    });
    fixture = TestBed.createComponent(ReporteMovimientoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
