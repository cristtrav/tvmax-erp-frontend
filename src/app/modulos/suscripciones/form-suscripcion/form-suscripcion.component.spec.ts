import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSuscripcionComponent } from './form-suscripcion.component';

describe('FormSuscripcionComponent', () => {
  let component: FormSuscripcionComponent;
  let fixture: ComponentFixture<FormSuscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSuscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
