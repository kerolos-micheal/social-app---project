import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../../../core/auth/services/posts/posts.service';
import { Iposts } from '../../../../core/models/iposts.interface';
import { CommentsComponent } from '../comments/comments.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-community',
  imports: [CommentsComponent, RouterLink],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
})
export class CommunityComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  allPosts: WritableSignal<Iposts[]> = signal([]);
  openCommentPostIds: WritableSignal<string[]> = signal([]);
  editingPostId: WritableSignal<string | null> = signal(null);
  editPostBody: WritableSignal<string> = signal('');
  editPostImagePreview: WritableSignal<string | null> = signal(null);
  editPostImage?: File;
  isUpdatingPost = signal(false);

  toggleComments(postId: string): void {
    this.openCommentPostIds.update((postIds) =>
      postIds.includes(postId) ? postIds.filter((id) => id !== postId) : [...postIds, postId],
    );
  }

  ngOnInit(): void {
    this.getAllPosts();
  }
  getAllPosts() {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.allPosts.set(res.data.posts);
      },
      error: (err) => {
      },
    });
  }
  currentUserId = localStorage.getItem('id');
  openMenuPostId: WritableSignal<string | null> = signal(null);

  toggleMenu(postId: string): void {
    this.openMenuPostId.update((currentPostId) => currentPostId === postId ? null : postId);
  }

  closeMenu(): void {
    this.openMenuPostId.set(null);
  }

  startEditingPost(post: Iposts): void {
    this.editingPostId.set(post._id);
    this.editPostBody.set(post.body ?? '');
    this.editPostImage = undefined;
    this.editPostImagePreview.set(null);
    this.closeMenu();
  }

  setEditPostBody(event: Event): void {
    this.editPostBody.set((event.target as HTMLTextAreaElement).value);
  }

  selectEditPostImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.editPostImage = file;
    const reader = new FileReader();
    reader.onload = () => this.editPostImagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  cancelEditingPost(): void {
    this.editingPostId.set(null);
    this.editPostBody.set('');
    this.editPostImage = undefined;
    this.editPostImagePreview.set(null);
  }

  updatePost(post: Iposts): void {
    if (!this.editPostBody().trim() && !post.image && !this.editPostImage) return;

    const formData = new FormData();
    formData.append('body', this.editPostBody().trim());
    if (this.editPostImage) formData.append('image', this.editPostImage);

    this.isUpdatingPost.set(true);
    this.postsService.updatePost(post._id, formData).subscribe({
      next: () => {
        this.isUpdatingPost.set(false);
        this.cancelEditingPost();
        this.getAllPosts();
      },
      error: (err) => {
        this.isUpdatingPost.set(false);
      },
    });
  }

  deletePost(postId: string): void {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    this.postsService.deletePosts(postId).subscribe({
      next: () => {
        this.allPosts.update((posts) => posts.filter((post) => post._id !== postId));
        this.closeMenu();
      },
      error: () => {},
    });
  }

  updateCommentCount(postId: string, commentCount: number): void {
    this.allPosts.update((posts) => posts.map((post) =>
      post._id === postId ? { ...post, commentsCount: commentCount } : post,
    ));
  }
}

