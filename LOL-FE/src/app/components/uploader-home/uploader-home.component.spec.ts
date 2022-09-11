import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderHomeComponent } from './uploader-home.component';

describe('UploaderHomeComponent', () => {
  let component: UploaderHomeComponent;
  let fixture: ComponentFixture<UploaderHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploaderHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploaderHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
