import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaDepartamentosComponent } from './vista-departamentos.component';

describe('VistaDepartamentosComponent', () => {
  let component: VistaDepartamentosComponent;
  let fixture: ComponentFixture<VistaDepartamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaDepartamentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaDepartamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
