import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTimbradosComponent } from './vista-timbrados.component';

describe('VistaTimbradosComponent', () => {
  let component: VistaTimbradosComponent;
  let fixture: ComponentFixture<VistaTimbradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaTimbradosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaTimbradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
