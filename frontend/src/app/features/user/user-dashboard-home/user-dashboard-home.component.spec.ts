import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardHomeComponent } from './user-dashboard-home.component';

describe('UserDashboardHomeComponent', () => {
  let component: UserDashboardHomeComponent;
  let fixture: ComponentFixture<UserDashboardHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDashboardHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
