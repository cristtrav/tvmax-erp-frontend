import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResumenVentasGruposServiciosComponent } from './card-resumen-ventas-grupos-servicios.component';

describe('CardResumenVentasGruposServiciosComponent', () => {
  let component: CardResumenVentasGruposServiciosComponent;
  let fixture: ComponentFixture<CardResumenVentasGruposServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardResumenVentasGruposServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardResumenVentasGruposServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
