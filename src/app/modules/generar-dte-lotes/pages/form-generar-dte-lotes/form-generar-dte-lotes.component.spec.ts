import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGenerarDteLotesComponent } from './form-generar-dte-lotes.component';

describe('FormGenerarDteLotesComponent', () => {
  let component: FormGenerarDteLotesComponent;
  let fixture: ComponentFixture<FormGenerarDteLotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormGenerarDteLotesComponent]
    });
    fixture = TestBed.createComponent(FormGenerarDteLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
