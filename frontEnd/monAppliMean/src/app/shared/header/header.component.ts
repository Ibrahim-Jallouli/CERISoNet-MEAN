import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NotificationService } from 'src/app/_services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { WebSocketService } from 'src/app/_services/webSocket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  userAvatar: string = '';
  username: string | null = null;
  notifications: string[] = []; //  notifications array il va recevoir les notifications du service notificationService

  constructor(
        // injection de dépendances
    private authService: AuthService,
     private router: Router,
      private notificationService: NotificationService,
      private webSocketService : WebSocketService,
      private snackBar: MatSnackBar) 
      {// observable
        this.router.events.subscribe((event) => {   // chaque fois que l'utilisateur change de route on va vérifier si il est authentifié
        if (event instanceof NavigationEnd) {
        // Check authentication on route changes
        this.checkAuthentication();
      }
    });
  }
  @ViewChild(MatMenuTrigger) notificationMenuTrigger!: MatMenuTrigger;

  ngOnInit() {
    this.username = localStorage.getItem('username');
    //this.checkAuthentication();
    this.notificationService.getNotificationAddedObservable().subscribe(() => {
      this.notifications = this.notificationService.getNotifications();
      this.notificationMenuTrigger.openMenu();
    });
  }

// utiliser dans le boutton pour afficher les notifications
  showNotifications() {
    this.notifications = this.notificationService.getNotifications();
  }

  private checkAuthentication() {
    this.authService.isAuthenticated().subscribe({
      next: (response) => {
        this.isAuthenticated = response.authenticated;
        this.userAvatar = response.avatar;
        console.log('isAuthenticated after', this.isAuthenticated);
      },
      error: (error) => {
        console.error('Authentication check failed', error);
        this.isAuthenticated = false;
      }
    });
  }


  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        this.webSocketService.emitLogout();    // emit logout relattion avec accueilComponent
        console.log('Logout successful', response);
        this.notificationService.clearNotifications();  // suprimer les notifications
        this.username = localStorage.getItem('username');  // récupérer le nom d'utilisateur
        this.notificationService.addNotification(this.username+' a été déconnecté');  // l'utiliser pour afficher la notification
        this.snackBar.open(this.username+' a été déconnecté', '', {
          horizontalPosition: 'start',      //snackBar optionnel
          verticalPosition: 'bottom',
          duration: 2000, 
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Not authenticated redirected to login page', error);
        this.router.navigate(['/login']);
      }
    });
  }
  
}
