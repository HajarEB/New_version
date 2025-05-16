import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoctorTableComponent } from './admin-doctor-table.component';

describe('AdminDoctorTableComponent', () => {
  let component: AdminDoctorTableComponent;
  let fixture: ComponentFixture<AdminDoctorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDoctorTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDoctorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
