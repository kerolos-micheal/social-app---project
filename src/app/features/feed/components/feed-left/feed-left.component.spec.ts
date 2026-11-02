import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedLeftComponent } from './feed-left.component';

describe('FeedLeftComponent', () => {
  let component: FeedLeftComponent;
  let fixture: ComponentFixture<FeedLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedLeftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedLeftComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
