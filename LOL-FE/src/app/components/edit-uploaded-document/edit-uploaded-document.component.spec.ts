import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUploadedDocumentComponent } from './edit-uploaded-document.component';

describe('EditUploadedDocumentComponent', () => {
  let component: EditUploadedDocumentComponent;
  let fixture: ComponentFixture<EditUploadedDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUploadedDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUploadedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
