import {CellStatus} from "../enums/cell-status";
import {Ship} from "./ship";

export class Cell {
  x: number
  y: number
  status: CellStatus
  ship!: Ship

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.status = CellStatus.free
  }
}
