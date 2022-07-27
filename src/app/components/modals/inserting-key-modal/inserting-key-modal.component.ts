import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SocketService} from "../../../shared/services/socket.service";
import {GameService} from "../../../shared/services/game.service";

@Component({
  selector: 'app-inserting-key-modal',
  templateUrl: './inserting-key-modal.component.html',
  styleUrls: ['./inserting-key-modal.component.scss']
})
export class InsertingKeyModalComponent implements OnInit {
  form!: FormGroup
  key: string = ''

  constructor(private socketService: SocketService,
              private gameService: GameService) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.form = new FormGroup({
      key: new FormControl(this.key, [
        Validators.required
      ])
    })
  }

  enterKey(formValue: any) {
    this.socketService.emit('shipSet',
      {shipSet: this.gameService.player.field, nickname: this.gameService.player.nickname}).subscribe()
    this.socketService.emit('acceptingFightCall', formValue.key).subscribe()
  }
}
