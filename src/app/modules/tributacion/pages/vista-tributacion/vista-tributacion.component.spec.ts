import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTributacionComponent } from './vista-tributacion.component';

describe('VistaTributacionComponent', () => {
  let component: VistaTributacionComponent;
  let fixture: ComponentFixture<VistaTributacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaTributacionComponent]
    });
    fixture = TestBed.createComponent(VistaTributacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
