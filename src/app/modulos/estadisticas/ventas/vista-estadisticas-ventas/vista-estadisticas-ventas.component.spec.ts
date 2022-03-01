import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaEstadisticasVentasComponent } from './vista-estadisticas-ventas.component';

describe('VistaEstadisticasVentasComponent', () => {
  let component: VistaEstadisticasVentasComponent;
  let fixture: ComponentFixture<VistaEstadisticasVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaEstadisticasVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaEstadisticasVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
