import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndClaimComponent } from './search-and-claim.component';

describe('SearchAndClaimComponent', () => {
  let component: SearchAndClaimComponent;
  let fixture: ComponentFixture<SearchAndClaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchAndClaimComponent]
    });
    fixture = TestBed.createComponent(SearchAndClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
