import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResultsProcessComponent } from './view-results-process.component';

describe('ViewResultsProcessComponent', () => {
  let component: ViewResultsProcessComponent;
  let fixture: ComponentFixture<ViewResultsProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewResultsProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewResultsProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
