import {Field} from './field';
import {Ship} from './ship';
import {PlayerStatus} from './player-status';

export class Player {
  status!: PlayerStatus
  field: Field
  shipsArray: Ship[]
  nickname: string

  constructor(nickname: string) {
    this.field = new Field()
    this.shipsArray = []
    this.status = PlayerStatus.none
    this.nickname = nickname
  }

  resetField() {
    this.field = new Field()
    this.shipsArray = []
    this.status = PlayerStatus.none
  }
}
