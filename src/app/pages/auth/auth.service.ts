import { Injectable } from '@angular/core';
import {User} from "../../shared/interfaces/user";
import {Router} from "@angular/router";
import jwt_decode from 'jwt-decode';
import {SocketService} from "../../shared/services/socket.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  helper = new JwtHelperService();

  constructor(private router: Router,
              private socket: SocketService) {
  }

  login(response: any) {
    this.router.navigate(['/game'])
    localStorage.setItem('token', response.token)
  }

  logout() {
    this.socket.disconnect()
    this.router.navigate(['/login'])
    localStorage.removeItem('token');
  }

  public get isLoggedIn(): boolean {
    return (localStorage.getItem('token') !== null)
  }

  getJwtToken() {
    return localStorage.getItem('token')
  }

  get currentUser(): User {
    return jwt_decode(this.getJwtToken()!) || null
  }
}
