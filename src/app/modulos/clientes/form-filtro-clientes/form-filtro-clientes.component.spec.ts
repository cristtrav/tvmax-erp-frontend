import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiltroClientesComponent } from './form-filtro-clientes.component';

describe('FormFiltroClientesComponent', () => {
  let component: FormFiltroClientesComponent;
  let fixture: ComponentFixture<FormFiltroClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFiltroClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFiltroClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
