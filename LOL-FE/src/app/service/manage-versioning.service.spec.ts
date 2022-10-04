import { TestBed } from '@angular/core/testing';

import { ManageVersioningService } from './manage-versioning.service';

describe('ManageVersioningService', () => {
  let service: ManageVersioningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageVersioningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
