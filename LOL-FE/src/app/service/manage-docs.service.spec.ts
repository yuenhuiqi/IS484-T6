import { TestBed } from '@angular/core/testing';

import { ManageDocsService } from './manage-docs.service';

describe('ManageDocsService', () => {
  let service: ManageDocsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDocsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
