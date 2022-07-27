import {Component, OnInit} from '@angular/core';
import {GameService} from "../../shared/services/game.service";
import {SocketService} from "../../shared/services/socket.service";
import {Player} from "../../shared/models/player";
import {Game} from "../../shared/models/game";
import {AuthService} from "../auth/auth.service";
import {GameStatus} from 'src/app/shared/enums/game-status';
import {MatDialog} from "@angular/material/dialog";
import {InsertingKeyModalComponent} from "../../components/modals/inserting-key-modal/inserting-key-modal.component";
import {BattleService} from "../../shared/services/battle.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(public gameService: GameService,
              public socketService: SocketService,
              private authService: AuthService,
              private dialog: MatDialog,
              private battleService: BattleService) {
  }

  ngOnInit(): void {
    this.createGame(this.authService.currentUser.nickname)
    this.socketService.connect()
    this.socketService.viewEvents()
    this.battleService.viewBattleEvents()
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
    this.battleService.startGame('challengeOpponent',
      this.gameService.player.nickname, this.gameService.player.field)
  }

  startWithRandomOpponent() {
    this.battleService.startGame('findRandomOpponent',
      this.gameService.player.nickname, this.gameService.player.field)
  }

  giveUp() {
    this.socketService.emit('giveup').subscribe()
  }

  takeChallenge() {
    this.dialog.open(InsertingKeyModalComponent)
  }

  createGame(userNickname: string) {
    this.gameService.player = new Player(userNickname);
    this.gameService.game = new Game()
    this.gameService.shipsInit()
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

  get opponentNickname(): string {
    return this.gameService.opponentNickname
  }
}
