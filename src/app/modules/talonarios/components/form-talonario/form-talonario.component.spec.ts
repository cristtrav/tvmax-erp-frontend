import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTalonarioComponent } from './form-talonario.component';

describe('FormTalonarioComponent', () => {
  let component: FormTalonarioComponent;
  let fixture: ComponentFixture<FormTalonarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormTalonarioComponent]
    });
    fixture = TestBed.createComponent(FormTalonarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
