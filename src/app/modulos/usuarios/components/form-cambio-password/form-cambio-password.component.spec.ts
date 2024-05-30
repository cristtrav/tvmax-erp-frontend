import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCambioPasswordComponent } from './form-cambio-password.component';

describe('FormCambioPasswordComponent', () => {
  let component: FormCambioPasswordComponent;
  let fixture: ComponentFixture<FormCambioPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCambioPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCambioPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
