import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaMaterialesComponent } from './vista-materiales.component';

describe('VistaMaterialesComponent', () => {
  let component: VistaMaterialesComponent;
  let fixture: ComponentFixture<VistaMaterialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaMaterialesComponent]
    });
    fixture = TestBed.createComponent(VistaMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
