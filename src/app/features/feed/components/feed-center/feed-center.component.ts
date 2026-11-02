import { MyFeedComponent } from './../my-feed/my-feed.component';
import { MyPostsComponent } from './../my-posts/my-posts.component';
import { CommunityComponent } from './../community/community.component';
import { SavedComponent } from './../saved/saved.component';
import { PostsService } from './../../../../core/auth/services/posts/posts.service';
import { Component, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IUserData } from '../../../../core/models/iposts.interface';
import { FormControl, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-feed-center',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
  ],
  templateUrl: './feed-center.component.html',
  styleUrl: './feed-center.component.css',
})
export class FeedCenterComponent implements OnInit {
@ViewChild(RouterOutlet) feedOutlet!: RouterOutlet;
@ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  private readonly postsService = inject(PostsService);
  selectedImg?: File;
  isSubmitting = signal(false);
  ngOnInit(): void {
    this.saveUserData();
  }

  loggedInUserData: WritableSignal<IUserData> = signal({} as IUserData);

  imgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);

  privacyInput = new FormControl('public');
  bodyInput = new FormControl('');

  saveUserData(): void {
    this.loggedInUserData.set(JSON.parse(localStorage.getItem('user')!));
  }
  selectImg(e: Event): void {
    if (e.target != null) {
      let target = e.target as HTMLInputElement;
      if (target.files != null && target.files.length > 0) {
        this.selectedImg = target.files[0];
        

        let fileReader = new FileReader();

        fileReader.readAsDataURL(this.selectedImg);

        fileReader.onload = (e: ProgressEvent<FileReader>) => {
          this.imgToDisplay.set(e.target?.result);
        };
      }
    }
  }

  canSubmitPost(): boolean {
    return !!this.bodyInput.value?.trim() || !!this.selectedImg;
  }

  submitCreate(e: SubmitEvent) {
    e.preventDefault();
    if (!this.canSubmitPost() || this.isSubmitting()) return;
    
    let myForm = new FormData()
    if (this.selectedImg) {
      myForm.append("image" , this.selectedImg )
    }
    if (this.bodyInput.value) {
      myForm.append("body" , this.bodyInput.value)
    }
    if (this.privacyInput.value) {
      myForm.append("privacy" , this.privacyInput.value)
    }
  
  this.isSubmitting.set(true);
  this.postsService.createPosts(myForm).subscribe({
  next: (res) => {
  this.bodyInput.reset('');
  this.privacyInput.reset('public');
  this.selectedImg = undefined;
  this.imgToDisplay.set(null);
  this.imageInput.nativeElement.value = '';
  this.isSubmitting.set(false);
  const activePage = this.feedOutlet.component;
  if (
    activePage instanceof MyFeedComponent ||
    activePage instanceof MyPostsComponent ||
    activePage instanceof CommunityComponent ||
    activePage instanceof SavedComponent
  ) {
    activePage.getAllPosts();
  }
  },
  error: (err) => {
  this.isSubmitting.set(false);
  
  }
  
  
  })
  }
  
  
}
