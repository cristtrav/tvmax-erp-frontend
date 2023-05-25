import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosClienteComponent } from './pagos-cliente.component';

describe('PagosClienteComponent', () => {
  let component: PagosClienteComponent;
  let fixture: ComponentFixture<PagosClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagosClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
