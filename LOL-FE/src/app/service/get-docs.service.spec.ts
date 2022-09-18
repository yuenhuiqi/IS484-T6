import { TestBed } from '@angular/core/testing';

import { GetDocsService } from './get-docs.service';

describe('GetDocsService', () => {
  let service: GetDocsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetDocsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
