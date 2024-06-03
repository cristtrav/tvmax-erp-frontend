import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTiposMaterialesComponent } from './vista-tipos-materiales.component';

describe('VistaTiposMaterialesComponent', () => {
  let component: VistaTiposMaterialesComponent;
  let fixture: ComponentFixture<VistaTiposMaterialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaTiposMaterialesComponent]
    });
    fixture = TestBed.createComponent(VistaTiposMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
