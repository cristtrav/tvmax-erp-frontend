import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorMaterialesComponent } from './buscador-materiales.component';

describe('BuscadorMaterialesComponent', () => {
  let component: BuscadorMaterialesComponent;
  let fixture: ComponentFixture<BuscadorMaterialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscadorMaterialesComponent]
    });
    fixture = TestBed.createComponent(BuscadorMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
