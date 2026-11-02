import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
 private readonly httpClient = inject(HttpClient);
  Id : any = localStorage.getItem("id");
   myHeaders : object ={
   headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('token')}`
      }
   }
  
  getPostComments(postId: string, page: number = 1): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/posts/${postId}/comments?page=${page}&limit=10`, this.myHeaders);
  }

  createComments(postId: string, body: FormData): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/posts/${postId}/comments`, body, this.myHeaders);
  }

  updateComment(postId: string, commentId: string, body: FormData): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/posts/${postId}/comments/${commentId}`, body, this.myHeaders);
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(`${environment.BaseUrl}/posts/${postId}/comments/${commentId}`, this.myHeaders);
  }
}
