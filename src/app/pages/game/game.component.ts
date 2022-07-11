import {Component, OnInit} from '@angular/core';
import {GameService} from "../../shared/services/game.service";
import {Game} from "../../shared/models/game";
import {Player} from "../../shared/models/player";
import {SocketService} from "../../shared/services/socket.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  playersCount: number = 0
  message: string = ''

  constructor(public gameService: GameService,
              private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.createGame()

    this.socketService.on('playersCount')
      .subscribe(count => {
        if (count) {
          this.playersCount = count
        }
      }, error => console.log(error.message))
  }

  displayGameStatus(): string {
    const status = this.gameService.game.status;
    switch (status) {
      case 0:
        return 'PREPARING';
      case 1:
        return 'STARTED';
      case 2:
        return 'WAITING FOR OPPONENT';
      case 3:
        return 'FINISHED';
      default:
        return 'NONE'
    }
  }

  callForFight() {
    this.socketService.startGame('challengeOpponent',
      this.gameService.player.nickname, this.gameService.player.field)
  }

  startWithRandomOpponent() {
    this.socketService.startGame('findRandomOpponent',
      this.gameService.player.nickname, this.gameService.player.field)
  }

  giveUp() {
    this.socketService.emit('giveup').subscribe()
  }

  sendMessage(message: string) {
    if (!message) {
      return
    }
    this.socketService.emit('message', message).subscribe()
    this.message = ''
  }

  takeChallenge() {
    const key = prompt('Enter the game key')
    this.socketService.emit('shipSet',
      {shipSet: this.gameService.player.field, nickname: this.gameService.player.nickname}).subscribe()
    this.socketService.emit('acceptingFightCall', key).subscribe()
  }

  createGame() {
    // @ts-ignore
    const name: string = prompt('Fill your name')

    this.gameService.player = new Player(name);
    this.gameService.game = new Game()
    this.gameService.shipsInit()
  }
}
