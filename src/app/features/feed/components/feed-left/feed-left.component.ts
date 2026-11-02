import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-feed-left',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './feed-left.component.html',
  styleUrl: './feed-left.component.css',
})
export class FeedLeftComponent {}
