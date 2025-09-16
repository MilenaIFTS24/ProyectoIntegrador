import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductsCraftsComponent } from './manage-products-crafts.component';

describe('ManageProductsCraftsComponent', () => {
  let component: ManageProductsCraftsComponent;
  let fixture: ComponentFixture<ManageProductsCraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProductsCraftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductsCraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
