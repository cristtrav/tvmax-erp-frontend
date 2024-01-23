import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiltroMaterialesComponent } from './form-filtro-materiales.component';

describe('FormFiltroMaterialesComponent', () => {
  let component: FormFiltroMaterialesComponent;
  let fixture: ComponentFixture<FormFiltroMaterialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFiltroMaterialesComponent]
    });
    fixture = TestBed.createComponent(FormFiltroMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
