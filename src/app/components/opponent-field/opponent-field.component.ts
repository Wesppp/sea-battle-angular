import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {GameService} from "../../shared/services/game.service";
import {Cell} from "../../shared/models/cell";
import {SocketService} from "../../shared/services/socket.service";
import {Field} from "../../shared/models/field";

@Component({
  selector: 'app-opponent-field',
  templateUrl: './opponent-field.component.html',
  styleUrls: ['./opponent-field.component.scss',
    '../../../assets/field.scss']
})
export class OpponentFieldComponent implements OnInit {
  @ViewChild('field') field!: ElementRef
  @ViewChildren('cell') cells!: QueryList<any>
  showShips: boolean = false

  constructor(private gameService: GameService,
              private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.on('showShips')
      .subscribe(field => {
        this.gameService.opponentField = field
        this.showShips = true
      })
  }

  makeShot(cell: Cell) {
    this.showShips = false
    if (this.gameService.game.status !== 'started' || !this.gameService.playerTurn) return;
    if (cell.status === 4 || cell.status === 3) return

    this.socketService.emit('addShot', {x: cell.x, y: cell.y}).subscribe()
  }

  get opponentField(): Field {
    return this.gameService.opponentField
  }
}
