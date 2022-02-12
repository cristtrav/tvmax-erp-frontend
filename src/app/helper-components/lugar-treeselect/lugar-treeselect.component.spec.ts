import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarTreeselectComponent } from './lugar-treeselect.component';

describe('LugarTreeselectComponent', () => {
  let component: LugarTreeselectComponent;
  let fixture: ComponentFixture<LugarTreeselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LugarTreeselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarTreeselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
