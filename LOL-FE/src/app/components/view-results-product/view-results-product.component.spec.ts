import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResultsProductComponent } from './view-results-product.component';

describe('ViewResultsProductComponent', () => {
  let component: ViewResultsProductComponent;
  let fixture: ComponentFixture<ViewResultsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewResultsProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewResultsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
