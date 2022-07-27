import {Component, Inject, OnInit} from '@angular/core';
import {Clipboard} from "@angular/cdk/clipboard";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import Swal from "sweetalert2";

@Component({
  selector: 'app-game-key-modal',
  templateUrl: './game-key.component.html',
  styleUrls: ['./game-key.component.scss']
})
export class GameKeyComponent implements OnInit {

  constructor(private clipboard: Clipboard,
              @Inject(MAT_DIALOG_DATA) public data: {
                key: string
              }) { }

  ngOnInit(): void {
  }

  copy() {
    this.clipboard.copy(this.data.key)
    Swal.fire('You did it!', '', 'success')
  }
}
