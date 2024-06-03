import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAsignacionReclamoComponent } from './detalle-asignacion-reclamo.component';

describe('DetalleAsignacionReclamoComponent', () => {
  let component: DetalleAsignacionReclamoComponent;
  let fixture: ComponentFixture<DetalleAsignacionReclamoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleAsignacionReclamoComponent]
    });
    fixture = TestBed.createComponent(DetalleAsignacionReclamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
