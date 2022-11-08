import { TestBed } from '@angular/core/testing';

import { ManageFeedbackServiceService } from './manage-feedback-service.service';

describe('ManageFeedbackServiceService', () => {
  let service: ManageFeedbackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageFeedbackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
