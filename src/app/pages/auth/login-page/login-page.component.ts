import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../../shared/interfaces/user";
import {UserService} from "../../../shared/services/user.service";
import {AuthService} from "../auth.service";
import {
  CustomRegistrationModalComponent
} from "../../../components/modals/custom-registration-modal/custom-registration-modal.component";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(public dialog: MatDialog,
              private userService: UserService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.openLoginDialog()
  }

  openLoginDialog = () => {
    this.dialog.open(CustomRegistrationModalComponent, {
      data: {
        title: 'Login',
        navigate: this.toRegistration,
        func: this.login
      },
      disableClose: true
    }, );
  }

  login = (user: User) => {
    this.userService.loginUser(user)
      .subscribe(response => {
        if (response) {
          this.dialog.closeAll()
          this.authService.login(response)
        }
      }, error => console.log(error.message))
  }

  toRegistration = () => {
    this.dialog.open(CustomRegistrationModalComponent, {
      data: {
        title: 'Registration',
        navigate: this.openLoginDialog,
        func: this.registration
      },
      disableClose: true
    })
  }

  registration = (user: User) => {
    this.userService.registrationUser(user)
      .subscribe(response => {
        if (response) {
          this.openLoginDialog()
        }
      }, error => console.log(error.message))
  }
}
