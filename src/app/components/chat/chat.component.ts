import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../shared/services/socket.service";
import {GameStatus} from "../../shared/enums/game-status";
import {GameService} from "../../shared/services/game.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message: string = ''

  constructor(private socketService: SocketService,
              private gameService: GameService) { }

  ngOnInit(): void {
  }

  sendMessage(message: string) {
    if (!message) { return }
    this.socketService.emit('message', message).subscribe()
    this.message = ''
  }

  get gameStatus(): GameStatus {
    return this.gameService.game.status
  }

  get messages(): string[] {
    return  this.gameService.messages
  }
}
