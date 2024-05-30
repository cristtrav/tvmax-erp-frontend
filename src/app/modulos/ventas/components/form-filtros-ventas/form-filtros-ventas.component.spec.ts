import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiltrosVentasComponent } from './form-filtros-ventas.component';

describe('FormFiltrosVentasComponent', () => {
  let component: FormFiltrosVentasComponent;
  let fixture: ComponentFixture<FormFiltrosVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFiltrosVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFiltrosVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
