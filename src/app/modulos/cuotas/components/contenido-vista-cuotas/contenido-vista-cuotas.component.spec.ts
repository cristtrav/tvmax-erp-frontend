import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoVistaCuotasComponent } from './contenido-vista-cuotas.component';

describe('ContenidoVistaCuotasComponent', () => {
  let component: ContenidoVistaCuotasComponent;
  let fixture: ComponentFixture<ContenidoVistaCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContenidoVistaCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenidoVistaCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
