import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAjusteExistenciaMaterialComponent } from './detalle-ajuste-existencia-material.component';

describe('DetalleAjusteExistenciaMaterialComponent', () => {
  let component: DetalleAjusteExistenciaMaterialComponent;
  let fixture: ComponentFixture<DetalleAjusteExistenciaMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleAjusteExistenciaMaterialComponent]
    });
    fixture = TestBed.createComponent(DetalleAjusteExistenciaMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
