import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsDialogComponent } from './search-results-dialog.component';

describe('SearchResultsDialogComponent', () => {
  let component: SearchResultsDialogComponent;
  let fixture: ComponentFixture<SearchResultsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchResultsDialogComponent]
    });
    fixture = TestBed.createComponent(SearchResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
