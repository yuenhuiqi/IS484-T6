import { TestBed } from '@angular/core/testing';

import { ManageSuggestedAcronymService } from './manage-suggested-acronym.service';

describe('ManageSuggestedAcronymService', () => {
  let service: ManageSuggestedAcronymService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSuggestedAcronymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
