import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomiciliosClienteComponent } from './domicilios-cliente.component';

describe('DomiciliosClienteComponent', () => {
  let component: DomiciliosClienteComponent;
  let fixture: ComponentFixture<DomiciliosClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomiciliosClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomiciliosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
