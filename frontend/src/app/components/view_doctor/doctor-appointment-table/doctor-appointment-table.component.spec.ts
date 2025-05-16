import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointmentTableComponent} from './doctor-appointment-table.component';

describe('DoctorAppointmentTableComponent', () => {
  let component:DoctorAppointmentTableComponent;
  let fixture: ComponentFixture<DoctorAppointmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAppointmentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAppointmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
