import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: string[] = [];  // tableau qui va contenir les notifications
  private notificationAdded$ = new Subject<void>();

  addNotification(message: string) {
    this.notifications.push(message);
    this.notificationAdded$.next();
  }

  getNotifications() {
    return this.notifications; // retourne le tableau
  }

  clearNotifications() {
    this.notifications = [];  // vider le tableau
  }


  // useless for now
  getNotificationAddedObservable() {
    return this.notificationAdded$.asObservable();
  }
}
