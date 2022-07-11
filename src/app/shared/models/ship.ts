export class Ship {
  size: number
  direction: string
  killed: boolean = false
  hit: number
  placed: boolean
  left: number
  top: number
  x!: number
  y!: number

  constructor(size: number, direction: string, left: number, top: number) {
    this.size = size
    this.direction = direction
    this.left = left
    this.top = top
    this.placed = false
    this.hit = 0
  }
}
