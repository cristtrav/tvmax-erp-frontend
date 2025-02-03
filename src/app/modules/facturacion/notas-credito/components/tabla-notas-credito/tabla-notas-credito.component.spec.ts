import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaNotasCreditoComponent } from './tabla-notas-credito.component';

describe('TablaNotasCreditoComponent', () => {
  let component: TablaNotasCreditoComponent;
  let fixture: ComponentFixture<TablaNotasCreditoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaNotasCreditoComponent]
    });
    fixture = TestBed.createComponent(TablaNotasCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
