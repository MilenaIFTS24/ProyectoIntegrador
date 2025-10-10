import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductsTeasComponent } from './manage-products-teas.component';

describe('ManageProductsTeasComponent', () => {
  let component: ManageProductsTeasComponent;
  let fixture: ComponentFixture<ManageProductsTeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProductsTeasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductsTeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
