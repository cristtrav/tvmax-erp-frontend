import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaNotasCreditoComponent } from './vista-notas-credito.component';

describe('VistaNotasCreditoComponent', () => {
  let component: VistaNotasCreditoComponent;
  let fixture: ComponentFixture<VistaNotasCreditoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaNotasCreditoComponent]
    });
    fixture = TestBed.createComponent(VistaNotasCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
