import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleNotaCreditoComponent } from './detalle-nota-credito.component';

describe('DetalleNotaCreditoComponent', () => {
  let component: DetalleNotaCreditoComponent;
  let fixture: ComponentFixture<DetalleNotaCreditoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleNotaCreditoComponent]
    });
    fixture = TestBed.createComponent(DetalleNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
