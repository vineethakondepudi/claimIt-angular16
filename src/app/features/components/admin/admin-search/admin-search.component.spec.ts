import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSearchComponent } from './admin-search.component';

describe('AdminSearchComponent', () => {
  let component: AdminSearchComponent;
  let fixture: ComponentFixture<AdminSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminSearchComponent]
    });
    fixture = TestBed.createComponent(AdminSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
