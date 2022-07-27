import { Injectable } from '@angular/core';
import {SocketService} from "./socket.service";
import {Field} from "../models/field";
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  constructor(private socketService: SocketService,
              private gameService: GameService) { }

  startGame(gameType: string, nickname: string, shipSet: Field) {
    this.socketService.emit('shipSet', {shipSet: shipSet, nickname: nickname}).subscribe()
    this.socketService.emit(gameType).subscribe()
  }

  addShot(shot: Object) {
    this.socketService.emit('addShot', shot).subscribe()
  }

  viewBattleEvents() {
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

    this.socketService.on('showShips')
      .subscribe(field => {
        this.gameService.opponentField = field
        this.gameService.showOpponentShips = true
      })
  }
}
