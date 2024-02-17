import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = 'https://pedago.univ-avignon.fr:3131';

  constructor(private http: HttpClient) {}

  // Get all messages with pagination support
  getAllMessages(page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/messages`, { params })
      .pipe(catchError(this.handleError));
  }

  // Search messages by hashtag with pagination support
  searchMessagesByHashtag(hashtag: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/messages-by-hashtag/${hashtag}`, { params })
      .pipe(catchError(this.handleError));
  }

  // Search messages by creator with pagination support
  searchMessagesByCreator(identifiant: string, page: number = 1, pageSize: number = 10): Observable<any> {
    console.log('identifiant', identifiant);
    return this.getUserIdByIdentifiant(identifiant).pipe(  // l'objectif est de récupérer l'id de l'utilisateur a partir de son identifiant
      catchError(this.handleError), 
      switchMap(userId => {
        console.log('userId', userId);
        // Get messages by creator using the obtained userId
        const params = new HttpParams()
          .set('page', page.toString())
          .set('pageSize', pageSize.toString());
  
        return this.http.get<any>(`${this.baseUrl}/messages-by-creator/${userId.userId}`, { params });
      }),
      catchError(this.handleError)
    );
  }


  // Add comment to a message
  addCommentToMessage(id: string, comment: string): Observable<any> {
    // il faut utiliser withCredentials: true si vous allez utiliser les cookies session ect...
    const options = {
      withCredentials: true
    };
  
    return this.http.post<any>(`${this.baseUrl}/messages/${id}/addcomment`, { comment }, options)
      .pipe(catchError(this.handleError));
  }
  
  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  getUserById(id: number): Observable<any> {
    const url = `${this.baseUrl}/user/${id}`; 
    return this.http.get(url);
  }

  getUserIdByIdentifiant(identifiant: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user-by-identifiant/${identifiant}`)
      .pipe(catchError(this.handleError));
  }
}


