import {Injectable} from '@angular/core';
import io from "socket.io-client";
import {Observable} from "rxjs";
import {GameService} from "./game.service";
import {HelperService} from "./helper.service";
import { environment } from "../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {GameKeyComponent} from "../../components/modals/game-key-modal/game-key.component";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any
  playersCount: number = 0

  constructor(private gameService: GameService,
              private helperService: HelperService,
              private dialog: MatDialog) {
  }

  connect() {
    this.socket = io(environment.serverUrl);
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

  viewEvents() {
    this.socket.on("connect", () => this.connected());
    this.socket.on("disconnect", () => this.disconnected());
    this.socket.on("error", (error: string) => {
      console.log(`ERROR: "${error}" (${environment.serverUrl})`);
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

    this.on('message')
      .subscribe((message: string) => {
        this.gameService.messages.push(message)
      }, error => console.log(error.message))

    this.on('challengeOpponent')
      .subscribe((key: string) => {
        this.dialog.open(GameKeyComponent, {data: {key: key}, disableClose: true})
      }, error => console.log(error.message))

    this.on('acceptingFightCall')
      .subscribe((isCorrectKey: boolean) => {
        if (!isCorrectKey) {
          this.helperService.alertMessage(`The key is entered incorrectly`)
        }
      }, error => console.log(error.message))

    this.on('opponentNickname')
      .subscribe(opponentNickname => {
        this.gameService.opponentNickname = opponentNickname
      })

    this.on('disconnected')
      .subscribe(() => {
        setTimeout(() => {
          this.helperService.alertMessage(`Your opponent was disconnected`)
        }, 0)
      })
  }
}
