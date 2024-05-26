import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoEstadisticasVentasComponent } from './contenido-estadisticas-ventas.component';

describe('ContenidoEstadisticasVentasComponent', () => {
  let component: ContenidoEstadisticasVentasComponent;
  let fixture: ComponentFixture<ContenidoEstadisticasVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContenidoEstadisticasVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenidoEstadisticasVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
