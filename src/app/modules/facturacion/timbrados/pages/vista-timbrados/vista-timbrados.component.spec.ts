import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTimbradosComponent } from './vista-timbrados.component';

describe('VistaTimbradosComponent', () => {
  let component: VistaTimbradosComponent;
  let fixture: ComponentFixture<VistaTimbradosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaTimbradosComponent]
    });
    fixture = TestBed.createComponent(VistaTimbradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
