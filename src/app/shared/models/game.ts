import {GameStatus} from "./game-status";
import {Player} from "./player";

export class Game {
  status: GameStatus

  constructor() {
    this.status = GameStatus.preparing
  }
}
