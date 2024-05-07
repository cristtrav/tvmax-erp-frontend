import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAsignacionesReclamosComponent } from './vista-asignaciones-reclamos.component';

describe('VistaAsignacionesReclamosComponent', () => {
  let component: VistaAsignacionesReclamosComponent;
  let fixture: ComponentFixture<VistaAsignacionesReclamosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAsignacionesReclamosComponent]
    });
    fixture = TestBed.createComponent(VistaAsignacionesReclamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
