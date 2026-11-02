import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  

  register(data: object): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/users/signup`, data);
  }

  login(data: object): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/users/signin`, data);
  }

  getProfileData(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/profile-data`, {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.patch(`${environment.BaseUrl}/users/change-password`, data, {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }
  
  logOut(){
  localStorage.removeItem("token") 
  localStorage.removeItem("user") 
  this.router.navigate(['/login']);
  }
  
}
