import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFinalizarReclamoComponent } from './form-finalizar-reclamo.component';

describe('FormFinalizarReclamoComponent', () => {
  let component: FormFinalizarReclamoComponent;
  let fixture: ComponentFixture<FormFinalizarReclamoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFinalizarReclamoComponent]
    });
    fixture = TestBed.createComponent(FormFinalizarReclamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
