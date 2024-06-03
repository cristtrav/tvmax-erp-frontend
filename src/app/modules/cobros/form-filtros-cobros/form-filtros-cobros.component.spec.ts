import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiltrosCobrosComponent } from './form-filtros-cobros.component';

describe('FormFiltrosCobrosComponent', () => {
  let component: FormFiltrosCobrosComponent;
  let fixture: ComponentFixture<FormFiltrosCobrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFiltrosCobrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFiltrosCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
