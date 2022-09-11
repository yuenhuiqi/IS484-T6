import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDocumentDetailsComponent } from './edit-document-details.component';

describe('EditDocumentDetailsComponent', () => {
  let component: EditDocumentDetailsComponent;
  let fixture: ComponentFixture<EditDocumentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDocumentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
