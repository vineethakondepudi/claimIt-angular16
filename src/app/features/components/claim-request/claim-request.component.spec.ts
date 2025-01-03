import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRequestComponent } from './claim-request.component';

describe('ClaimRequestComponent', () => {
  let component: ClaimRequestComponent;
  let fixture: ComponentFixture<ClaimRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClaimRequestComponent]
    });
    fixture = TestBed.createComponent(ClaimRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
