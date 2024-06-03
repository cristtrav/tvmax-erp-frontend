import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDetallesVentasComponent } from './reporte-detalles-ventas.component';

describe('ReporteCobrosComponent', () => {
  let component: ReporteDetallesVentasComponent;
  let fixture: ComponentFixture<ReporteDetallesVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteDetallesVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDetallesVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
