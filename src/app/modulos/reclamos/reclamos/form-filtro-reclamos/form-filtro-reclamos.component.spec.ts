import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiltroReclamosComponent } from './form-filtro-reclamos.component';

describe('FormFiltroReclamosComponent', () => {
  let component: FormFiltroReclamosComponent;
  let fixture: ComponentFixture<FormFiltroReclamosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFiltroReclamosComponent]
    });
    fixture = TestBed.createComponent(FormFiltroReclamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
