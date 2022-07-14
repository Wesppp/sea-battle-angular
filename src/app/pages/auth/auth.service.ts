import { Injectable } from '@angular/core';
import {User} from "../../shared/interfaces/user";
import {Router} from "@angular/router";
import jwt_decode from 'jwt-decode';
import {SocketService} from "../../shared/services/socket.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser!: User

  constructor(private router: Router,
              private socket: SocketService) { }

  login(response: any) {
    this.currentUser = response.signed_user
    this.router.navigate(['/game'])
    localStorage.setItem('token', response.token)
  }

  logout() {
    this.socket.disconnect()
    this.router.navigate(['/login'])
    localStorage.removeItem('token');
  }

  public get logIn(): boolean {
    this.checkLoginStatus()
    return (localStorage.getItem('token') !== null)
  }

  getJwtToken() {
    return localStorage.getItem('token')
  }

  checkLoginStatus() {
    try {
      let token = this.getJwtToken()
      this.currentUser = jwt_decode(token!)
    } catch (e) {
      console.log(e)
    }
  }
}
