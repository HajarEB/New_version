import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorNewAppointmentComponent } from './doctor-new-appointment.component';

describe('DoctorNewAppointmentComponent', () => {
  let component: DoctorNewAppointmentComponent;
  let fixture: ComponentFixture<DoctorNewAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorNewAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorNewAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
