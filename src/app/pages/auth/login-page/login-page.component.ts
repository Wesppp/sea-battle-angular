import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../../shared/interfaces/user";
import {UserService} from "../../../shared/services/user.service";
import {AuthService} from "../auth.service";
import {
  CustomRegistrationModalComponent
} from "../../../components/modals/custom-registration-modal/custom-registration-modal.component";
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(public dialog: MatDialog,
              private userService: UserService,
              private authService: AuthService,
              private router: Router) {
    if (this.authService.isLoggedIn) { this.router.navigate(['/game']) }
  }

  ngOnInit(): void {
    this.openLoginDialog()
  }

  openLoginDialog = () => {
    this.dialog.closeAll()
    this.dialog.open(CustomRegistrationModalComponent, {
      data: {
        title: 'Login',
        navigate: this.openRegistrationDialog,
        func: this.login
      },
      disableClose: true
    }, );
  }

  login = (user: User, form: FormGroup) => {
    this.userService.loginUser(user)
      .subscribe(response => {
        if (response) {
          this.dialog.closeAll()
          form.reset()
          this.authService.login(response)
        }
      }, error => console.log(error.message))
  }

  openRegistrationDialog = () => {
    this.dialog.closeAll()
    this.dialog.open(CustomRegistrationModalComponent, {
      data: {
        title: 'Registration',
        navigate: this.openLoginDialog,
        func: this.registration
      },
      disableClose: true
    })
  }

  registration = (user: User, form: FormGroup) => {
    this.userService.registrationUser(user)
      .subscribe(response => {
        if (response) {
          form.reset()
          this.openLoginDialog()
        }
      }, error => console.log(error.message))
  }
}
