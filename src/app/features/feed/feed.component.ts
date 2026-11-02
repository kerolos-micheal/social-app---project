import { Component } from '@angular/core';
import { FeedRightComponent } from './components/feed-right/feed-right.component';
import { FeedLeftComponent } from './components/feed-left/feed-left.component';
import { FeedCenterComponent } from './components/feed-center/feed-center.component';

@Component({
  selector: 'app-feed',
  imports: [FeedRightComponent, FeedLeftComponent, FeedCenterComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {}
