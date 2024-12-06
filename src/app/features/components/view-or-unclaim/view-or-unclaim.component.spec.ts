import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrUnclaimComponent } from './view-or-unclaim.component';

describe('ViewOrUnclaimComponent', () => {
  let component: ViewOrUnclaimComponent;
  let fixture: ComponentFixture<ViewOrUnclaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewOrUnclaimComponent]
    });
    fixture = TestBed.createComponent(ViewOrUnclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
