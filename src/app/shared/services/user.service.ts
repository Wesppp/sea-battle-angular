import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {catchError, finalize, Observable, of} from "rxjs";
import {User} from "../interfaces/user";
import {HelperService} from "./helper.service";
import {GameHistory} from "../interfaces/gameHistory";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl: string = environment.usersUrl
  isDisabled: boolean = false

  constructor(private http: HttpClient,
              private helperService: HelperService) { }

  loginUser(user: User): Observable<User> {
    if (this.isDisabled) {return of()}
    this.isDisabled = true

    const url = `${this.userUrl}/login`
    return this.http.post<User>(url, user, this.httpOptions).pipe(
      catchError(this.helperService.handleError<User>("login user")),
      finalize(() => this.isDisabled = false)
    )
  }

  registrationUser(user: User): Observable<User> {
    if (this.isDisabled) {return of()}
    this.isDisabled = true

    const url = `${this.userUrl}/registration`
    return this.http.post<User>(url, user, this.httpOptions).pipe(
      catchError(this.helperService.handleError<User>("registration user")),
      finalize(() => this.isDisabled = false)
    )
  }

  getGameHistory(userId: string): Observable<GameHistory[]> {
    const url = `${this.userUrl}/getGameHistory/${userId}`
    return this.http.get<GameHistory[]>(url).pipe(
      catchError(this.helperService.handleError<GameHistory[]>("get game history"))
    )
  }

  httpOptions = {
    headers: new HttpHeaders({ "Accept": "application/json", "Content-Type": "application/json" })
  };
}
