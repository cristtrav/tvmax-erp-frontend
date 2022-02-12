import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoServicioTreeselectComponent } from './grupo-servicio-treeselect.component';

describe('GrupoServicioTreeselectComponent', () => {
  let component: GrupoServicioTreeselectComponent;
  let fixture: ComponentFixture<GrupoServicioTreeselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoServicioTreeselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoServicioTreeselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
