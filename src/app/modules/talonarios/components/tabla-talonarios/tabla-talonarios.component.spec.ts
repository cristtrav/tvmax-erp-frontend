import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTalonariosComponent } from './tabla-talonarios.component';

describe('TablaTalonariosComponent', () => {
  let component: TablaTalonariosComponent;
  let fixture: ComponentFixture<TablaTalonariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaTalonariosComponent]
    });
    fixture = TestBed.createComponent(TablaTalonariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
