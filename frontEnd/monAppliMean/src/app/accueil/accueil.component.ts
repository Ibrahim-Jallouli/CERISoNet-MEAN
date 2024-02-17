import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../_services/notification.service';
import { WebSocketService } from '../_services/webSocket.service'; // Import WebSocketService
import { User } from '../models/User';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  username: string | null = null;
  currentAvatar: string | null = null;
  lastLogin: string | null = null;
  users: User[] = [];
  selectedSection: string = 'home';
  userPosts: any[] = [];
  showForm: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService ,
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username'); // récupère le username du localStorage
    this.currentAvatar = localStorage.getItem(this.username + '_avatar'); // récupère l'avatar du localStorage
    this.webSocketService.emitInitialize(); // emit event dans ngOnInit pour récupérer les users

    this.webSocketService.onInitialize().subscribe({
      next: (data) => {
        this.users = data.filter((user: User) => user.identifiant !== this.username); // exclure l'utilisateur courant
        console.log(this.users);
      },
      error: (error) => {
        console.error('Error in onLogin subscription:', error);
      },
    });

    this.webSocketService.onLogin().subscribe({
      next: (data) => {
        this.users = data.filter((user: User) => user.identifiant !== this.username); // exclure l'utilisateur courant
        console.log(this.users);
        this.notificationService.addNotification("un utilisateur s'est connecté");
        
      },
      error: (error) => {
        console.error('Error in onLogin subscription:', error);
      },
    });
    
    this.webSocketService.onLogout().subscribe({
      next: (data) => {
        this.users = data.filter((user: User) => user.identifiant !== this.username); // exclure l'utilisateur courant
        console.log(this.users);
        this.notificationService.addNotification("un utilisateur s'est déconnecté");  
      },
      error: (error) => {
        console.error('Error in onLogout subscription:', error);
      },
      complete: () => {
        console.log('onLogout subscription completed');
      },
    });
    
  }

  navigateTo(section: string) {
    this.selectedSection = section;
    if (section === 'my-posts') {
    }
  }

  openForm() {
    this.showForm = !this.showForm;
  }
}

