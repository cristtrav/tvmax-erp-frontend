import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaCobradoresComponent } from './vista-cobradores.component';

describe('VistaCobradoresComponent', () => {
  let component: VistaCobradoresComponent;
  let fixture: ComponentFixture<VistaCobradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaCobradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaCobradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
