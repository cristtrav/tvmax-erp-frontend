import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRucComponent } from './detalle-ruc.component';

describe('DetalleRucComponent', () => {
  let component: DetalleRucComponent;
  let fixture: ComponentFixture<DetalleRucComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleRucComponent]
    });
    fixture = TestBed.createComponent(DetalleRucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
