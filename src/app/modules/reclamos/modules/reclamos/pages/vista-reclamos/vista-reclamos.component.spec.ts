import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaReclamosComponent } from './vista-reclamos.component';

describe('VistaReclamosComponent', () => {
  let component: VistaReclamosComponent;
  let fixture: ComponentFixture<VistaReclamosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaReclamosComponent]
    });
    fixture = TestBed.createComponent(VistaReclamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
