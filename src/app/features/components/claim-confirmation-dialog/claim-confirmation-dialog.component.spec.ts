import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimConfirmationDialogComponent } from './claim-confirmation-dialog.component';

describe('ClaimConfirmationDialogComponent', () => {
  let component: ClaimConfirmationDialogComponent;
  let fixture: ComponentFixture<ClaimConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClaimConfirmationDialogComponent]
    });
    fixture = TestBed.createComponent(ClaimConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
