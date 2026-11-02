import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommentsComponent } from '../features/feed/components/comments/comments.component';
import { PostsService } from '../core/auth/services/posts/posts.service';
import { Iposts } from '../core/models/iposts.interface';

@Component({
  selector: 'app-post-details',
  imports: [DatePipe, RouterLink, CommentsComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);

  post = signal<Iposts | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const postId = params.get('postId');
      if (postId) this.loadPost(postId);
    });
  }

  private loadPost(postId: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.postsService.getSinglePosts(postId).subscribe({
      next: (res) => {
        this.post.set(res.data?.post ?? res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  updateCommentCount(commentCount: number): void {
    this.post.update((currentPost) => currentPost ? { ...currentPost, commentsCount: commentCount } : null);
  }
}
