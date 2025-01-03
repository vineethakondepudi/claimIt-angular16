import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingClaimComponent } from './pending-claim.component';

describe('PendingClaimComponent', () => {
  let component: PendingClaimComponent;
  let fixture: ComponentFixture<PendingClaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PendingClaimComponent]
    });
    fixture = TestBed.createComponent(PendingClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
