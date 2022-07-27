import {GameStatus} from "../enums/game-status";

export class Game {
  status: GameStatus

  constructor() {
    this.status = GameStatus.preparing
  }
}
