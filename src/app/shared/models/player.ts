import {Field} from './field';
import {Ship} from './ship';

export class Player {
  field: Field
  shipsArray: Ship[]
  nickname: string

  constructor(nickname: string) {
    this.field = new Field()
    this.shipsArray = []
    this.nickname = nickname
  }

  resetField() {
    this.field = new Field()
    this.shipsArray = []
  }
}
