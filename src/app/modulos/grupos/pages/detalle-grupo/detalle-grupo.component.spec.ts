import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleGrupoComponent } from './detalle-grupo.component';

describe('FormGruposComponent', () => {
  let component: DetalleGrupoComponent;
  let fixture: ComponentFixture<DetalleGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleGrupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
