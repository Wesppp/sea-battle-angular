import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {GameService} from "../../shared/services/game.service";
import {Cell} from "../../shared/models/cell";
import {SocketService} from "../../shared/services/socket.service";
import {Field} from "../../shared/models/field";
import {BattleService} from "../../shared/services/battle.service";

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
              private socketService: SocketService,
              private battleService: BattleService) {}

  ngOnInit(): void {
  }

  makeShot(cell: Cell) {
    if (this.gameService.game.status !== 'started' || !this.gameService.playerTurn) return;
    if (cell.status === 'hit' || cell.status === 'miss') return

    this.battleService.addShot({x: cell.x, y: cell.y})
  }

  get opponentField(): Field {
    return this.gameService.opponentField
  }

  get showOpponentShips(): boolean {
    return this.gameService.showOpponentShips
  }
}
