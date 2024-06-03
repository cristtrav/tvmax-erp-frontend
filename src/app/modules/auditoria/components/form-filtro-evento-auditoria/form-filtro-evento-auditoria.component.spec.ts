import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiltroEventoAuditoriaComponent } from './form-filtro-evento-auditoria.component';

describe('FormFiltroEventoAuditoriaComponent', () => {
  let component: FormFiltroEventoAuditoriaComponent;
  let fixture: ComponentFixture<FormFiltroEventoAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFiltroEventoAuditoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFiltroEventoAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
