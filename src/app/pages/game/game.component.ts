import {Component, OnInit} from '@angular/core';
import {GameService} from "../../shared/services/game.service";
import {SocketService} from "../../shared/services/socket.service";
import {Player} from "../../shared/models/player";
import {Game} from "../../shared/models/game";
import {AuthService} from "../auth/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {GameHistoriesModalComponent} from "../../components/modals/game-histories-modal/game-histories-modal.component";
import {GameStatus} from 'src/app/shared/models/game-status';
import {HelperService} from "../../shared/services/helper.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  message: string = ''

  constructor(public gameService: GameService,
              public socketService: SocketService,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.createGame(this.authService.currentUser.nickname)
    this.socketService.connect()
    this.socketService.viewEvents()
  }

  displayGameStatus(): string {
    const status = this.gameService.game.status;
    switch (status) {
      case 'preparing':
        return 'PREPARING';
      case 'started':
        return 'STARTED';
      case 'waiting_for_opponent':
        return 'WAITING FOR OPPONENT';
      case 'finished':
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
    if (!message) { return }
    this.socketService.emit('message', message).subscribe()
    this.message = ''
  }

  takeChallenge() {
    const key = prompt('Enter the game key')
    this.socketService.emit('shipSet',
      {shipSet: this.gameService.player.field, nickname: this.gameService.player.nickname}).subscribe()
    this.socketService.emit('acceptingFightCall', key).subscribe()
  }

  createGame(userNickname: string) {
    this.gameService.player = new Player(userNickname);
    this.gameService.game = new Game()
    this.gameService.shipsInit()
  }

  logout() {
    this.authService.logout()
  }

  openGameHistories() {
    this.dialog.open(GameHistoriesModalComponent)
  }

  playAgain() {
    this.gameService.restartGame()
  }

  cancelGame() {
    this.socketService.emit('cancelGame').subscribe()
    this.gameService.game.status = GameStatus.preparing
  }

  get gameStatus(): GameStatus {
    return this.gameService.game.status
  }

  get isPlayerReady(): boolean {
    return this.gameService.isPlayerReady
  }
}
