import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDomicilioComponent } from './detalle-domicilio.component';

describe('DetalleDomicilioComponent', () => {
  let component: DetalleDomicilioComponent;
  let fixture: ComponentFixture<DetalleDomicilioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleDomicilioComponent]
    });
    fixture = TestBed.createComponent(DetalleDomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
