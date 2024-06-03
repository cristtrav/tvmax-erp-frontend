import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaSorteosComponent } from './vista-sorteos.component';

describe('VistaSorteosComponent', () => {
  let component: VistaSorteosComponent;
  let fixture: ComponentFixture<VistaSorteosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaSorteosComponent]
    });
    fixture = TestBed.createComponent(VistaSorteosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
