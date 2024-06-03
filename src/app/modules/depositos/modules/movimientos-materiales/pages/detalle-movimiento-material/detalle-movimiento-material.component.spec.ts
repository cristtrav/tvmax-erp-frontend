import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMovimientoMaterialComponent } from './detalle-movimiento-material.component';

describe('DetalleMovimientoMaterialComponent', () => {
  let component: DetalleMovimientoMaterialComponent;
  let fixture: ComponentFixture<DetalleMovimientoMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMovimientoMaterialComponent]
    });
    fixture = TestBed.createComponent(DetalleMovimientoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
