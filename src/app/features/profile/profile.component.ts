import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth/auth.service';
import { PostsService } from '../../core/auth/services/posts/posts.service';
import { Iposts, IUserProfile } from '../../core/models/iposts.interface';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly postsService = inject(PostsService);

  profile = signal<IUserProfile | null>(null);
  myPosts = signal<Iposts[]>([]);
  savedPosts = signal<Iposts[]>([]);
  activeTab = signal<'posts' | 'saved'>('posts');
  isLoadingProfile = signal(true);
  isLoadingPosts = signal(true);
  isLoadingSavedPosts = signal(true);
  profileError = signal('');
  myPostsError = signal('');
  savedPostsError = signal('');
  defaultProfilePhoto = '/assets/default-profile.png';

  followerCount = computed(() => {
    const profile = this.profile();
    return profile?.followersCount ?? profile?.followers?.length ?? 0;
  });

  followingCount = computed(() => {
    const profile = this.profile();
    return profile?.followingCount ?? profile?.following?.length ?? 0;
  });

  displayedPosts = computed(() => this.activeTab() === 'posts' ? this.myPosts() : this.savedPosts());
  isLoadingDisplayedPosts = computed(() => this.activeTab() === 'posts' ? this.isLoadingPosts() : this.isLoadingSavedPosts());
  displayedPostsError = computed(() => this.activeTab() === 'posts' ? this.myPostsError() : this.savedPostsError());

  coverStyle = computed(() => {
    const cover = this.profile()?.cover;
    return cover ? `linear-gradient(rgba(30, 27, 75, .25), rgba(30, 27, 75, .25)), url("${cover}")` : null;
  });

  ngOnInit(): void {
    this.loadProfile();
    this.loadMyPosts();
    this.loadSavedPosts();
  }

  selectTab(tab: 'posts' | 'saved'): void {
    this.activeTab.set(tab);
  }

  private loadProfile(): void {
    this.authService.getProfileData().subscribe({
      next: (res) => {
        const profileData = res.data?.user ?? res.data?.profile ?? res.data;
        this.profile.set(profileData as IUserProfile);
        this.isLoadingProfile.set(false);
      },
      error: (err) => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            this.profile.set(JSON.parse(savedUser) as IUserProfile);
          } catch {
            this.profileError.set('Could not load your profile. Please try again.');
          }
        } else {
          this.profileError.set(err.error?.message || 'Could not load your profile. Please try again.');
        }
        this.isLoadingProfile.set(false);
      },
    });
  }

  private loadMyPosts(): void {
    this.postsService.getMyPosts().subscribe({
      next: (res) => {
        this.myPosts.set(res.data.posts ?? []);
        this.isLoadingPosts.set(false);
      },
      error: () => {
        this.myPostsError.set('Could not load your posts. Please try again.');
        this.isLoadingPosts.set(false);
      },
    });
  }

  private loadSavedPosts(): void {
    this.postsService.getSavedPosts().subscribe({
      next: (res) => {
        this.savedPosts.set(res.data.bookmarks ?? []);
        this.isLoadingSavedPosts.set(false);
      },
      error: () => {
        this.savedPostsError.set('Could not load your saved posts. Please try again.');
        this.isLoadingSavedPosts.set(false);
      },
    });
  }
}
