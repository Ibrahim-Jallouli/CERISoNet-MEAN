import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('wss://pedago.univ-avignon.fr:3131');
    this.socket.emit('initialize');
  }

  emitInitialize(): void {
    console.log('Emitting initialize event');
    this.socket.emit('initialize');
  }

onInitialize(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('initialize', (data) => {
        console.log('Received initialize event:', data);
        observer.next(data); // Pass the received data to the observer
      });
    });
  }

  // Listen for 'login' event
  onLogin(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('login', (data) => {
        console.log('Received login event:', data);
        observer.next(data); // Pass the received data to the observer
      });
    });
  }

  // Listen for 'logout' event
  onLogout(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('logout', (data) => {
        console.log('Received logout event:', data);
        observer.next(data); // Pass the received data to the observer
      });
    });
  }

  // Emit 'login' event
  emitLogin(): void {
    console.log('Emitting login event:');
    this.socket.emit('login');
  }

  // Emit 'logout' event
  emitLogout(): void {
    console.log('Emitting logout event');
    this.socket.emit('logout');
  }



  // Listen for 'add-like' event
  onAddLike(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('add-like', (data) => {
        console.log('Received add-like event:', data);
        observer.next(data);
      });
    });
  }

  // Listen for 'remove-like' event
  onRemoveLike(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('remove-like', (data) => {
        console.log('Received remove-like event:', data);
        observer.next(data);
      });
    });
  }

  // Emit 'add-like' event
  emitAddLike(messageId: number): void {
    console.log(`Emitting add-like event for message ${messageId}`);
    this.socket.emit('add-like', messageId);
  }

  // Emit 'remove-like' event
  emitRemoveLike(messageId: number): void {
    console.log(`Emitting remove-like event for message ${messageId}`);
    this.socket.emit('remove-like', messageId);
  }

}
