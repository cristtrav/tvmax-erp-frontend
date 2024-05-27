import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionReclamoComponent } from './ubicacion-reclamo.component';

describe('UbicacionReclamoComponent', () => {
  let component: UbicacionReclamoComponent;
  let fixture: ComponentFixture<UbicacionReclamoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UbicacionReclamoComponent]
    });
    fixture = TestBed.createComponent(UbicacionReclamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
