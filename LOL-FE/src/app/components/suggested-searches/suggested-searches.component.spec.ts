import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedSearchesComponent } from './suggested-searches.component';

describe('SuggestedSearchesComponent', () => {
  let component: SuggestedSearchesComponent;
  let fixture: ComponentFixture<SuggestedSearchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedSearchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestedSearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
