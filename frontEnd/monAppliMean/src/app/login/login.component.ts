import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { NotificationService } from '../_services/notification.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketService } from '../_services/webSocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    // injection de dépendances
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private webSocketService:WebSocketService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.notificationService.clearNotifications(); // supprime les notifications
  }
  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      let theDate: string | null = null;
      this.authService.login(username, password).subscribe((response) => {
        if (response.success) {
          this.webSocketService.emitLogin(); // emit login event relation avec accueil.component
           // Récupère la dernière date de connexion pour l'utilisateur spécifique from the localStorage
          const lastLoginString = localStorage.getItem(username + '_lastLogin');
          if (lastLoginString) {
            theDate = new Date(lastLoginString).toLocaleString();
          }
  
          // Stocke la date et l'heure actuelles comme nouvelle date de dernière connexion pour l'utilisateur spécifique  
          const lastLogin = new Date().toISOString();
          localStorage.setItem(username + '_lastLogin', lastLogin); // username+_lastLogin pour éviter les conflits
          localStorage.setItem('username', username);
          localStorage.setItem(username+'_avatar', response.avatar);
  
          // Push la date de la dernière connexion au service de notification
          if (theDate) {
            this.notificationService.addNotification('Bienvenue à nouveau '+username+' votre dernière connexion : ' + theDate);
          } else {
            // the first login
            this.notificationService.addNotification('Bienvenue, ' + username);
          }
          // Redirect to the "accueil" component 
          this.router.navigate(['/accueil']);
        } else {
          // Push a notification 
          this.notificationService.addNotification("Informations d'identification erronées");
        }
      });
    }else{
      this.snackBar.open("Veuillez s'il vous plaît entrer votre nom d'utilisateur et votre mot de passe", '', {
        horizontalPosition: 'start',  // optionnel
        verticalPosition: 'bottom',
        duration: 2000, // 2 secondes
      });
    }
  }
  

  

}
