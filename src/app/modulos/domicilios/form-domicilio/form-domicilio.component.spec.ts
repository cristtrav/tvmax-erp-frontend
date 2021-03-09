import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDomicilioComponent } from './form-domicilio.component';

describe('FormDomicilioComponent', () => {
  let component: FormDomicilioComponent;
  let fixture: ComponentFixture<FormDomicilioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDomicilioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
