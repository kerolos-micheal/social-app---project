import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedCenterComponent } from './feed-center.component';

describe('FeedCenterComponent', () => {
  let component: FeedCenterComponent;
  let fixture: ComponentFixture<FeedCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedCenterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedCenterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
