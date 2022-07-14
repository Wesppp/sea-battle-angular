import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../shared/interfaces/user";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-custom-registration-modal',
  templateUrl: './custom-registration-modal.component.html',
  styleUrls: ['./custom-registration-modal.component.scss']
})
export class CustomRegistrationModalComponent implements OnInit {
  form!: FormGroup
  user: User = {nickname: '', password: ''}

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
   title: string,
   func: any,
   navigate: any
  }) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      nickname: new FormControl(this.user.nickname, [
        Validators.required,
        Validators.maxLength(30)
      ]),
      password: new FormControl(this.user.password, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(16)
      ])
    })
  }
}
