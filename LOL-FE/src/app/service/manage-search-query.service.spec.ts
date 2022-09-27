import { TestBed } from '@angular/core/testing';

import { ManageSearchQueryService } from './manage-search-query.service';

describe('ManageSearchQueryService', () => {
  let service: ManageSearchQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSearchQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
