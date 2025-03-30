import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAjustesExistenciasMaterialesComponent } from './vista-ajustes-existencias-materiales.component';

describe('VistaAjustesExistenciasMaterialesComponent', () => {
  let component: VistaAjustesExistenciasMaterialesComponent;
  let fixture: ComponentFixture<VistaAjustesExistenciasMaterialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAjustesExistenciasMaterialesComponent]
    });
    fixture = TestBed.createComponent(VistaAjustesExistenciasMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
