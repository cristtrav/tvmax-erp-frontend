import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMaterialComponent } from './detalle-material.component';

describe('DetalleMaterialComponent', () => {
  let component: DetalleMaterialComponent;
  let fixture: ComponentFixture<DetalleMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMaterialComponent]
    });
    fixture = TestBed.createComponent(DetalleMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
