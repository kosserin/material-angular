import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket;
  private messagesSubject = new Subject<any>();

  constructor() {
    // Initialize WebSocket connection
    this.socket = new WebSocket('ws://localhost:8081/frontend_notifications');

    // Listen for messages
    this.socket.onmessage = (event) => {
      console.log(event);
      
      this.messagesSubject.next(event.data);
    };
    
    // Handle errors
    this.socket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };
  }

  // Send a message
  sendMessage(message: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open.');
    }
  }

  // Get observable for incoming messages
  getMessages() {
    return this.messagesSubject.asObservable();
  }

  // Close the WebSocket connection
  close() {
    this.socket.close();
  }
}
