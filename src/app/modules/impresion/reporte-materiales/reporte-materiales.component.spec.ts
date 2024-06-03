import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMaterialesComponent } from './reporte-materiales.component';

describe('ReporteMaterialesComponent', () => {
  let component: ReporteMaterialesComponent;
  let fixture: ComponentFixture<ReporteMaterialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteMaterialesComponent]
    });
    fixture = TestBed.createComponent(ReporteMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
