import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTimbradoTalonariosComponent } from './vista-timbrado-talonarios.component';

describe('VistaTimbradoTalonariosComponent', () => {
  let component: VistaTimbradoTalonariosComponent;
  let fixture: ComponentFixture<VistaTimbradoTalonariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaTimbradoTalonariosComponent]
    });
    fixture = TestBed.createComponent(VistaTimbradoTalonariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
