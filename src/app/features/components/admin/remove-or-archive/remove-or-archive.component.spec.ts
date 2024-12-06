import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOrArchiveComponent } from './remove-or-archive.component';

describe('RemoveOrArchiveComponent', () => {
  let component: RemoveOrArchiveComponent;
  let fixture: ComponentFixture<RemoveOrArchiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RemoveOrArchiveComponent]
    });
    fixture = TestBed.createComponent(RemoveOrArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
