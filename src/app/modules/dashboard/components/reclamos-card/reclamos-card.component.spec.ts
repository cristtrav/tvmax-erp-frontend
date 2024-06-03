import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamosCardComponent } from './reclamos-card.component';

describe('ReclamosCardComponent', () => {
  let component: ReclamosCardComponent;
  let fixture: ComponentFixture<ReclamosCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamosCardComponent]
    });
    fixture = TestBed.createComponent(ReclamosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
