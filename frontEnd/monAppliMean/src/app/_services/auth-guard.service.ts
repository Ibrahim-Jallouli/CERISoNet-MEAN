import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((response: any) => {
        if (response.authenticated) {// authenticated => json response from the server
          return true; // User is authenticated, allow access to the route
        } else {
          this.router.navigate(['/login']); // User is not authenticated, redirect to the login page
          return false;
        }
      })
    );
  }
}
