import {Component, OnInit} from '@angular/core';
import {SocketService} from "./shared/services/socket.service";
import {GameService} from "./shared/services/game.service";
import {Field} from "./shared/models/field";
import {HelperService} from "./shared/services/helper.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'sea-battle-angular';

  constructor(private gameService: GameService,
              private socketService: SocketService,
              private helperService: HelperService) {
  }

  ngOnInit() {
    this.socketService.on('statusChange')
      .subscribe(status => {
        if (status) {
          this.gameService.game.status = this.gameService.mapGameStatus(status)
          this.gameService.isEnd(status)
        }
      }, error => console.log(error.message))

    this.socketService.on('turnUpdate')
      .subscribe(isTurn => {
        this.gameService.playerTurn = isTurn
      }, error => console.log(error.message))

    this.socketService.on('updateField')
      .subscribe((newField: Field) => {
        if (this.gameService.playerTurn) {
          this.gameService.opponentField = newField
        } else {
          this.gameService.player.field = newField
        }
      }, error => console.log(error.message))

    this.socketService.on('message')
      .subscribe((message: string) => {
        this.gameService.messages.push(message)
      }, error => console.log(error.message))

    this.socketService.on('challengeOpponent')
      .subscribe((key: string) => {
        this.helperService.alertMessage(`Copy the key and send it to your opponent: ${key}`)
      }, error => console.log(error.message))

    this.socketService.on('acceptingFightCall')
      .subscribe((isCorrectKey: boolean) => {
        if (!isCorrectKey) {
          this.helperService.alertMessage(`The key is entered incorrectly`)
        }
      }, error => console.log(error.message))
  }
}
