import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDateDialogComponent } from './update-date-dialog.component';

describe('UpdateDateDialogComponent', () => {
  let component: UpdateDateDialogComponent;
  let fixture: ComponentFixture<UpdateDateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UpdateDateDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
