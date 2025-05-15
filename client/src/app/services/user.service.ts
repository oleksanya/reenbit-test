import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'api/user';

  http = inject(HttpClient);
  
  constructor() { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getCurrentUser(): Observable<{ user: User }> {
    const token = localStorage.getItem('jwtToken');
    return this.http.get<{ user: User }>(`${this.apiUrl}/getUser`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

    createUser(userData: { 
    firstName: string; 
    secondName: string; 
    profileImg?: string; 
  }): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateProfileImage(userId: string, profileImg: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/changeProfileImg/${userId}`, { profileImg });
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${userId}`);
  }
}
