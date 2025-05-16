import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdminTableComponent } from './admin-admin-table.component';

describe('AdminAdminAdminTableComponent', () => {
  let component: AdminAdminTableComponent;
  let fixture: ComponentFixture<AdminAdminTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAdminTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAdminTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
