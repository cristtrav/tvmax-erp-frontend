import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContactoClienteComponent } from './form-contacto-cliente.component';

describe('FormContactoClienteComponent', () => {
  let component: FormContactoClienteComponent;
  let fixture: ComponentFixture<FormContactoClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormContactoClienteComponent]
    });
    fixture = TestBed.createComponent(FormContactoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
