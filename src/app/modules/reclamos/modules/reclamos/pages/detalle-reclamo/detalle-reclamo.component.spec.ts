import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleReclamoComponent } from './detalle-reclamo.component';

describe('DetalleReclamoComponent', () => {
  let component: DetalleReclamoComponent;
  let fixture: ComponentFixture<DetalleReclamoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleReclamoComponent]
    });
    fixture = TestBed.createComponent(DetalleReclamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
