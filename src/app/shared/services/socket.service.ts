import { Injectable } from '@angular/core';
import io from "socket.io-client";
import {Observable} from "rxjs";
import {Field} from "../models/field";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  host: string = "http://localhost:3300"
  socket: any

  constructor() {
    this.socket = io(this.host);
    this.socket.on("connect", () => this.connected());
    this.socket.on("disconnect", () => this.disconnected());
    this.socket.on("error", (error: string) => {
      console.log(`ERROR: "${error}" (${this.host})`);
    });
  }

  connect () {
    this.socket.connect();
  }

  disconnect () {
    this.socket.disconnect();
  }

  emit<T>(chanel: string, data?: T) {
    return new Observable<any>(observer => {
      this.socket.emit(chanel, data, function (data: any) {
        if (data.success) {
          observer.next(data.msg);
        } else {
          observer.error(data.msg);
        }
        observer.complete();
      });
    });
  }

  on(event_name: string) {
    return new Observable<any>(observer => {
      this.socket.off(event_name);
      this.socket.on(event_name, (data: any) => {
        observer.next(data);
      });
    });
  }

  connected() {
    console.log('Connected');
  }

  disconnected() {
    console.log('Disconnected');
  }

  startGame(gameType: string, nickname: string, shipSet: Field) {
    this.emit('shipSet', {shipSet: shipSet, nickname: nickname}).subscribe()
    this.emit(gameType).subscribe()
  }
}
