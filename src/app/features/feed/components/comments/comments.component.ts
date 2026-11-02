import { Component, inject, input, InputSignal, OnInit, output, signal, WritableSignal } from '@angular/core';
import { CommentsService } from '../../../../core/auth/services/comments/comments.service';
import { comment } from '../../../../core/models/iposts.interface';

@Component({
  selector: 'app-comments', 
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit{

private readonly commentsService = inject(CommentsService)

postId : InputSignal<string> = input.required<string>()
commentCount: InputSignal<number> = input.required<number>()
postOwnerId: InputSignal<string> = input.required<string>()
commentCountChange = output<number>();
comments : WritableSignal<comment[]> = signal([])
currentPage = 1;
hasMoreComments = signal(true);
isLoadingComments = signal(false);
isCreatingComment = signal(false);
isUpdatingComment = signal(false);
deletingCommentId: WritableSignal<string | null> = signal(null);
currentUserId = localStorage.getItem('id');
newCommentContent = signal('');
newCommentImage?: File;
newCommentImagePreview: WritableSignal<string | null> = signal(null);
editingCommentId: WritableSignal<string | null> = signal(null);
editingCommentContent = signal('');
editCommentImage?: File;
editCommentImagePreview: WritableSignal<string | null> = signal(null);

ngOnInit(): void {
  this.getPostComments()
}

getPostComments(){
this.loadComments(1, false);
}

loadMoreComments(): void {
  if (this.isLoadingComments() || !this.hasMoreComments()) return;
  this.loadComments(this.currentPage + 1, true);
}

private loadComments(page: number, append: boolean): void {
  this.isLoadingComments.set(true);
  this.commentsService.getPostComments(this.postId(), page).subscribe({
      next: (res) => {
        const nextComments: comment[] = res.data.comments;
        this.currentPage = page;
        this.comments.update((existingComments) =>
          append ? [...existingComments, ...nextComments] : nextComments,
        );
        this.hasMoreComments.set(nextComments.length === 10);
        this.isLoadingComments.set(false);
      },
      error: (err) => {
       this.isLoadingComments.set(false);
       
      },
    })
}

setNewCommentContent(event: Event): void {
  this.newCommentContent.set((event.target as HTMLTextAreaElement).value);
}

selectNewCommentImage(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  this.newCommentImage = file;
  this.readImagePreview(file, (preview) => this.newCommentImagePreview.set(preview));
}

createComment(): void {
  const content = this.newCommentContent().trim();
  if ((!content && !this.newCommentImage) || this.isCreatingComment()) return;

  const formData = new FormData();
  formData.append('content', content);
  if (this.newCommentImage) formData.append('image', this.newCommentImage);

  this.isCreatingComment.set(true);
  this.commentsService.createComments(this.postId(), formData).subscribe({
    next: (res) => {
      this.commentCountChange.emit(this.commentCount() + 1);
      const createdComment = res.data?.comment ?? res.data;
      if (createdComment?._id && createdComment?.content !== undefined) {
        this.comments.update((comments) => [
          createdComment as comment,
          ...comments.filter((item) => item._id !== createdComment._id),
        ]);
      } else {
        this.refreshFirstPage();
      }
      this.newCommentContent.set('');
      this.newCommentImage = undefined;
      this.newCommentImagePreview.set(null);
      this.isCreatingComment.set(false);
    },
    error: (err) => {
      this.isCreatingComment.set(false);
    },
  });
}

startEditingComment(commentToEdit: comment): void {
  this.editingCommentId.set(commentToEdit._id);
  this.editingCommentContent.set(commentToEdit.content);
  this.editCommentImage = undefined;
  this.editCommentImagePreview.set(null);
}

setEditingCommentContent(event: Event): void {
  this.editingCommentContent.set((event.target as HTMLTextAreaElement).value);
}

selectEditCommentImage(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  this.editCommentImage = file;
  this.readImagePreview(file, (preview) => this.editCommentImagePreview.set(preview));
}

cancelEditingComment(): void {
  this.editingCommentId.set(null);
  this.editingCommentContent.set('');
  this.editCommentImage = undefined;
  this.editCommentImagePreview.set(null);
}

updateComment(commentToUpdate: comment): void {
  const content = this.editingCommentContent().trim();
  if ((!content && !commentToUpdate.image && !this.editCommentImage) || this.isUpdatingComment()) return;

  const formData = new FormData();
  formData.append('content', content);
  if (this.editCommentImage) formData.append('image', this.editCommentImage);

  this.isUpdatingComment.set(true);
  this.commentsService.updateComment(this.postId(), commentToUpdate._id, formData).subscribe({
    next: (res) => {
      const updatedComment = res.data?.comment;
      this.comments.update((comments) => comments.map((item) =>
        item._id === commentToUpdate._id
          ? {
              ...item,
              ...(updatedComment ?? {}),
              content,
              image: updatedComment?.image ?? this.editCommentImagePreview() ?? item.image,
            }
          : item,
      ));
      this.cancelEditingComment();
      this.isUpdatingComment.set(false);
    },
    error: (err) => {
      this.isUpdatingComment.set(false);
    },
  });
}

deleteComment(commentId: string): void {
  const commentToDelete = this.comments().find((item) => item._id === commentId);
  const isCommentOwner = commentToDelete?.commentCreator._id === this.currentUserId;
  const isPostOwner = this.postOwnerId() === this.currentUserId;
  if ((!isCommentOwner && !isPostOwner) || this.deletingCommentId()) return;
  if (!window.confirm('Are you sure you want to delete this comment?')) return;

  this.deletingCommentId.set(commentId);
  this.commentsService.deleteComment(this.postId(), commentId).subscribe({
    next: () => {
      this.comments.update((comments) => comments.filter((item) => item._id !== commentId));
      this.commentCountChange.emit(Math.max(0, this.commentCount() - 1));
      this.deletingCommentId.set(null);
    },
    error: (err) => {
      this.deletingCommentId.set(null);
    },
  });
}

private refreshFirstPage(): void {
  this.commentsService.getPostComments(this.postId(), 1).subscribe({
    next: (res) => {
      const firstPage: comment[] = res.data.comments;
      this.comments.update((currentComments) => {
        const firstPageIds = new Set(firstPage.map((item) => item._id));
        return [...firstPage, ...currentComments.filter((item) => !firstPageIds.has(item._id))];
      });
    },
    error: () => {},
  });
}

private readImagePreview(file: File, onLoad: (preview: string) => void): void {
  const reader = new FileReader();
  reader.onload = () => onLoad(reader.result as string);
  reader.readAsDataURL(file);
}
}
