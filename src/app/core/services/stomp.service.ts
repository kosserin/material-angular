import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { NotificationResponse } from '../models/notification-response.model';

@Injectable({
  providedIn: 'root',
})
export class StompService {
  private socket = new SockJS('http://localhost:8081/mfmaster-websocket');
  private stompClient = Stomp.over(this.socket);

  subscribe(topic: string, callback: (message: any) => void): void {
    this.stompClient.connect({}, () => {
      this.subscribeToTopic(topic, callback);
    });
  }

  private subscribeToTopic(
    topic: string,
    callback: (message: NotificationResponse) => void
  ): void {
    this.stompClient.subscribe(topic, (message: any) => {
      // Extract and log the response body
      const responseBody: NotificationResponse = JSON.parse(message.body);
      callback(responseBody);
    });
  }
}
