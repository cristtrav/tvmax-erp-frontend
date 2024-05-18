import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagEstadosComponent } from './tag-estados.component';

describe('TagEstadosComponent', () => {
  let component: TagEstadosComponent;
  let fixture: ComponentFixture<TagEstadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagEstadosComponent]
    });
    fixture = TestBed.createComponent(TagEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
