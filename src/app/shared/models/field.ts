import { Cell } from "./cell";
import {Ship} from "./ship";

export class Field {
  shots: Cell[][] = []
  ships: Ship[]

  constructor() {
    const shots: Cell[][] = []

    for (let i = 0; i < 10; i++) {
      shots[i] = []
      for (let j = 0; j < 10; j++) {
        shots[i][j] = new Cell(i, j)
      }
    }

    this.shots = shots
    this.ships = []
  }
}
