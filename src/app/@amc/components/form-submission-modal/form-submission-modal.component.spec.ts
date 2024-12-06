import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubmissionModalComponent } from './form-submission-modal.component';

describe('FormSubmissionModalComponent', () => {
  let component: FormSubmissionModalComponent;
  let fixture: ComponentFixture<FormSubmissionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormSubmissionModalComponent]
    });
    fixture = TestBed.createComponent(FormSubmissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
