import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorMotivosComponent } from './buscador-motivos.component';

describe('BuscadorMotivosComponent', () => {
  let component: BuscadorMotivosComponent;
  let fixture: ComponentFixture<BuscadorMotivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscadorMotivosComponent]
    });
    fixture = TestBed.createComponent(BuscadorMotivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
