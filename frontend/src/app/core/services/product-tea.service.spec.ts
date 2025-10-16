import { TestBed } from '@angular/core/testing';

import { ProductTeaService } from './product-tea.service';

describe('ProductTeaService', () => {
  let service: ProductTeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTeaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
