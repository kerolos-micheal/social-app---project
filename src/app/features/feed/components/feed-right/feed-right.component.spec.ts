import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedRightComponent } from './feed-right.component';

describe('FeedRightComponent', () => {
  let component: FeedRightComponent;
  let fixture: ComponentFixture<FeedRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedRightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedRightComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
