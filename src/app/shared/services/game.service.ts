import {ElementRef, Injectable, QueryList} from '@angular/core';
import {Game} from "../models/game";
import {Player} from "../models/player";
import {Ship} from "../models/ship";
import {GameStatus} from "../models/game-status";
import {HelperService} from "./helper.service";
import {Field} from "../models/field";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  shipData: any = [
    {size: 4, direction: "row", startX: 10, startY: 355},
    {size: 3, direction: "row", startX: 10, startY: 400},
    {size: 3, direction: "row", startX: 120, startY: 400},
    {size: 2, direction: "row", startX: 10, startY: 445},
    {size: 2, direction: "row", startX: 88, startY: 445},
    {size: 2, direction: "row", startX: 167, startY: 445},
    {size: 1, direction: "row", startX: 10, startY: 490},
    {size: 1, direction: "row", startX: 55, startY: 490},
    {size: 1, direction: "row", startX: 100, startY: 490},
    {size: 1, direction: "row", startX: 145, startY: 490},
  ]

  game!: Game
  player!: Player
  opponentField: Field = new Field()
  playerTurn: boolean = false
  messages: string[] = []

  constructor(private helperService: HelperService) {
  }

  shipsInit() {
    for (const {size, direction, startX, startY} of this.shipData) {
      const ship = new Ship(size, direction, startX, startY)
      this.player.shipsArray.push(ship)
    }
  }

  shipValidation(x: number, y: number, ship: Ship): boolean {
    const dy = +(ship.direction === 'row')
    const dx = +(ship.direction === 'column')

    for (let i = 0; i < ship.size; i++) {
      let cx = x + dx * i
      let cy = y + dy * i

      if (this.helperService.inField(cx, cy)) {
        if (this.player.field.shots[cx][cy].status !== 1) return false
      } else {
        return false
      }
    }

    return true
  }

  addShipToField(field: ElementRef, cell: ElementRef, ship: Ship) {
    const fieldRect = field.nativeElement.getBoundingClientRect()
    const cellRect = cell.nativeElement.getBoundingClientRect()
    const {x: cellX, y: cellY} = cell.nativeElement.dataset
    ship.x = +cellX
    ship.y = +cellY

    if (!this.shipValidation(+cellX, +cellY, ship)) { return }

    this.fillShipPosition(ship)

    ship.left = cellRect.left - fieldRect.left
    ship.top = cellRect.top - fieldRect.top
    ship.placed = true

    if (this.player.field.ships.includes(ship)) { return }
    this.player.field.ships.push(ship)

    if (this.player.field.ships.length === 10) {
      this.helperService.isPlayerReady(true)
    }
  }

  clearShipPosition(ship: Ship) {
    const dy = +(ship.direction === 'row')
    const dx = +(ship.direction === 'column')

    if (ship.x !== undefined && ship.y !== undefined) {
      for (let x = ship.x - 1; x < +ship.x + ship.size * dx + dy + 1; x++) {
        for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
          if (this.helperService.inField(x, y)) {
            this.player.field.shots[x][y].status = 1
          }
        }
      }
    }
  }

  fillShipPosition(ship: Ship) {
    const dy = +(ship.direction === 'row')
    const dx = +(ship.direction === 'column')

    for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++) {
      for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
        if (this.helperService.inField(x, y)) {
          this.player.field.shots[x][y].status = 0
        }
      }
    }

    for (let i = 0; i < ship.size; i++) {
      this.player.field.shots[ship.x + dx * i][ship.y + dy * i].status = 2
      this.player.field.shots[ship.x + dx * i][ship.y + dy * i].ship = ship
    }
  }

  restartGame() {
    this.opponentField = new Field()
    this.game.status = GameStatus.preparing
    this.messages = []
    this.resetPlayerField()
  }

  resetPlayerField() {
    this.player.resetField()
    this.shipsInit()
    this.helperService.isPlayerReady(false)
  }

  randomizeField(cells: QueryList<any>, field: ElementRef) {
    this.resetPlayerField()
    let cellsMatrix = this.helperService.convMatrix(cells.toArray(), 10)

    for(let i = 0; i < 10; i++) {
      const ship = this.player.shipsArray[i]
      ship.direction = this.helperService.getRandomFrom(["row", "column"])

      while (!ship.placed) {
        const x = this.helperService.getRandomBetween(0, 9)
        const y = this.helperService.getRandomBetween(0, 9)

        this.addShipToField(field, cellsMatrix[x][y], ship)
      }
    }
  }

  mapGameStatus(status: string): GameStatus {
    switch (status) {
      case 'play':
        return GameStatus.started;
      case 'finding':
        return GameStatus.waiting_for_opponent;
      case 'loser':
      case 'winner':
        return GameStatus.finished
      default:
        return GameStatus.preparing
    }
  }
}
