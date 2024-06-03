import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoVistaDomiciliosComponent } from './contenido-vista-domicilios.component';

describe('ContenidoVistaDomiciliosComponent', () => {
  let component: ContenidoVistaDomiciliosComponent;
  let fixture: ComponentFixture<ContenidoVistaDomiciliosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContenidoVistaDomiciliosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenidoVistaDomiciliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
