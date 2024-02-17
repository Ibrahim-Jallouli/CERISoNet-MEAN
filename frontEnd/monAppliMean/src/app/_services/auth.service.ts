import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://pedago.univ-avignon.fr:3131';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    // il faut utiliser withCredentials: true si vous allez utiliser les cookies session ect...
    return this.http.post(`${this.baseUrl}/login`, { username, password }, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('HTTP request error:', error);
        return throwError('An error occurred');
      })
    );
  }


  // the isAuthenticated method to check if the user has a valid session
  isAuthenticated(): Observable<any> {
    return this.http.get(`${this.baseUrl}/check-authentication`, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`,{}, { withCredentials: true });
  }


  
}
