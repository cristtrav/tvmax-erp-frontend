import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTipoMaterialComponent } from './detalle-tipo-material.component';

describe('DetalleTipoMaterialComponent', () => {
  let component: DetalleTipoMaterialComponent;
  let fixture: ComponentFixture<DetalleTipoMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleTipoMaterialComponent]
    });
    fixture = TestBed.createComponent(DetalleTipoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
