import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewAppointmentComponent } from './admin-new-appointment.component';

describe('AdminNewAppointmentComponent', () => {
  let component: AdminNewAppointmentComponent;
  let fixture: ComponentFixture<AdminNewAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
