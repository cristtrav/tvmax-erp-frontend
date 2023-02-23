import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioFormatoPreAComponent } from './formulario-formato-pre-a.component';

describe('FormularioFormatoPreAComponent', () => {
  let component: FormularioFormatoPreAComponent;
  let fixture: ComponentFixture<FormularioFormatoPreAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioFormatoPreAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioFormatoPreAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
