import { TestBed } from '@angular/core/testing';

import { ProductCraftService } from './product-craft.service';

describe('ProductCraftService', () => {
  let service: ProductCraftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCraftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
