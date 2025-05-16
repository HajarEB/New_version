import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAppointmentTableComponent } from './admin-appointment-table.component';

describe('AdminAdminAppointmentTableComponentComponent', () => {
  let component: AdminAppointmentTableComponent;
  let fixture: ComponentFixture<AdminAppointmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAppointmentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAppointmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
