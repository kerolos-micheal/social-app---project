import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);
  Id : any = localStorage.getItem("id");
   myHeaders : object ={
   headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('token')}`
      }
   }
  
  getAllPosts(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/posts`, this.myHeaders);
  }
  getAllHomeFeedPosts(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/posts/feed?only=following&limit=10`, this.myHeaders);
  }
  getMyPosts(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/${this.Id}/posts`, this.myHeaders);
  }
  getSavedPosts(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/bookmarks`, this.myHeaders);
  }
  
  createPosts(body :any): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/posts`, body ,this.myHeaders);
  }

  updatePost(postId: string, body: FormData): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/posts/${postId}`, body, this.myHeaders);
  }
  
  getSinglePosts(postId :any): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/posts/${postId}`,this.myHeaders);
  }
  deletePosts(postId :any): Observable<any> {
    return this.httpClient.delete(`${environment.BaseUrl}/posts/${postId}`,this.myHeaders);
  }
  updatePosts(postId :any): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/posts/${postId}`,this.myHeaders);
  }
  getSuggestedFriends(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/suggestions?limit=10`, this.myHeaders);
  }
}
