import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateAdminDialogComponent } from './admin-update-admin-dialog.component';

describe('AdminUpdateAdminDialogComponent', () => {
  let component: AdminUpdateAdminDialogComponent;
  let fixture: ComponentFixture<AdminUpdateAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateAdminDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
