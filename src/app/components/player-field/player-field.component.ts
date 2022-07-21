import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList, HostListener, AfterViewInit, Input
} from '@angular/core';
import {GameService} from "../../shared/services/game.service";
import {CdkDragEnd, CdkDragStart} from "@angular/cdk/drag-drop";
import {Ship} from "../../shared/models/ship";
import {HelperService} from "../../shared/services/helper.service";
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {GameStatus} from "../../shared/models/game-status";

@Component({
  selector: 'app-player-field',
  templateUrl: './player-field.component.html',
  styleUrls: ['./player-field.component.scss',
    '../../../assets/field.scss',
    '../../../assets/ship-size.scss']
})
export class PlayerFieldComponent implements OnInit, AfterViewInit {
  @Input() gameStatus!: GameStatus
  @ViewChild('field') field!: ElementRef
  @ViewChildren('cell') cells!: QueryList<any>
  isDragged: boolean = false
  draggedShip!: Ship
  isSmallScreen: boolean = false

  @HostListener("wheel", ["$event"]) public onScroll(event: WheelEvent) {
    if (this.isDragged) {
      this.draggedShip.direction = this.draggedShip.direction === 'row'? 'column': 'row'
    }
  }

  constructor(public gameService: GameService,
              private helperService: HelperService,
              public breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.breakpointObserver
        .observe(['(max-width: 870px)'])
        .subscribe((state: BreakpointState) => {
          if (state.matches && this.gameStatus === 'preparing') {
            this.randomize()
            this.isSmallScreen = true
          } else {
            this.isSmallScreen = false
          }
        });
    }, 0)
  }

  dragStart($event: CdkDragStart) {
    this.isDragged = true
    const {data: ship} = $event.source
    this.draggedShip = ship
    this.gameService.clearShipPosition(ship)
    this.gameService.player.field.ships.forEach(s => {
      if (s !== ship) this.gameService.fillShipPosition(s)
    })
  }

  dragEnded($event: CdkDragEnd) {
    this.isDragged = false
    if (this.gameService.game.status !== 'preparing') {return}

    const {data: ship} = $event.source
    const shipElement = $event.source.element.nativeElement
    let cells = this.cells.toArray()

    const {left, top} = shipElement.getBoundingClientRect()
    const point = {x: left + 13, y: top + 13}
    const cell = cells.find(cell => this.helperService.isUnder(point, cell))

    if (cell) {
      this.gameService.addShipToField(this.field, cell, ship)
      $event.source._dragRef.reset();
    } else {
      $event.source._dragRef.reset();
      ship.direction = 'row'
    }
  }

  randomize() {
    this.gameService.randomizeField(this.cells, this.field)
  }
}
