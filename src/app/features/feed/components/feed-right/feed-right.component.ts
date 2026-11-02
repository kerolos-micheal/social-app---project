import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../../../core/auth/services/posts/posts.service';
import { SuggestedFriends } from '../../../../core/models/iposts.interface';

@Component({
  selector: 'app-feed-right',
  imports: [],
  templateUrl: './feed-right.component.html',
  styleUrl: './feed-right.component.css',
})
export class FeedRightComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  frinds: WritableSignal<SuggestedFriends[]> = signal([]);

  ngOnInit(): void {
    this.getAllPosts();
  }
  getAllPosts() {
    this.postsService.getSuggestedFriends().subscribe({
      next: (res) => {
        this.frinds.set(res.data.suggestions);
      },
      error: (err) => {
      },
    });
  }
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
