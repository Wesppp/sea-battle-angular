import {Field} from './field';
import {Ship} from './ship';
import {PlayerStatus} from "../enums/player-status";

export class Player {
  field: Field
  shipsArray: Ship[]
  nickname: string
  status: PlayerStatus

  constructor(nickname: string) {
    this.field = new Field()
    this.shipsArray = []
    this.nickname = nickname
    this.status = PlayerStatus.none
  }

  resetField() {
    this.field = new Field()
    this.shipsArray = []
  }
}
