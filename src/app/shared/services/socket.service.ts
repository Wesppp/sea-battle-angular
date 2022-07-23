import {Injectable} from '@angular/core';
import io from "socket.io-client";
import {Observable} from "rxjs";
import {Field} from "../models/field";
import {GameService} from "./game.service";
import {HelperService} from "./helper.service";
import Swal from "sweetalert2";
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  host: string = "http://localhost:3300"
  socket: any
  playersCount: number = 0

  constructor(private gameService: GameService,
              private helperService: HelperService,
              private clipboard: Clipboard) {
  }

  connect() {
    this.socket = io(this.host);
    this.socket.connect();
  }

  disconnect() {
    this.socket.close();
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

  viewEvents() {
    this.socket.on("connect", () => this.connected());
    this.socket.on("disconnect", () => this.disconnected());
    this.socket.on("error", (error: string) => {
      console.log(`ERROR: "${error}" (${this.host})`);
    });

    this.on('statusChange')
      .subscribe(status => {
        if (status) {
          this.gameService.game.status = this.gameService.mapGameStatus(status)
          this.gameService.isEnd(status)
        }
      }, error => console.log(error.message))

    this.on('playersCount')
      .subscribe(count => {
        if (count) {
          this.playersCount = count
        }
      }, error => console.log(error.message))

    this.on('reconnection')
      .subscribe(() => {
        alert('Rec')
      }, error => console.log(error.message))

    this.on('turnUpdate')
      .subscribe(isTurn => {
        this.gameService.playerTurn = isTurn
      }, error => console.log(error.message))

    this.on('updateField')
      .subscribe((newField: Field) => {
        if (this.gameService.playerTurn) {
          this.gameService.opponentField = newField
        } else {
          this.gameService.player.field = newField
        }
      }, error => console.log(error.message))

    this.on('message')
      .subscribe((message: string) => {
        this.gameService.messages.push(message)
      }, error => console.log(error.message))

    this.on('challengeOpponent')
      .subscribe((key: string) => {
        console.log('challengeOpponent:', key)
        this.helperService.popupWithConfirm(`Copy the key and send it to your opponent: ${key}`, 'Copy')
          .then((result) => {
            if (result.isConfirmed) {
              this.clipboard.copy(key)
              Swal.fire('You did it!', '', 'success')
            }
          })
      }, error => console.log(error.message))

    this.on('acceptingFightCall')
      .subscribe((isCorrectKey: boolean) => {
        if (!isCorrectKey) {
          this.helperService.alertMessage(`The key is entered incorrectly`)
        }
      }, error => console.log(error.message))
  }
}
