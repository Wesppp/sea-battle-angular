import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../pages/auth/auth.service";
import {UserService} from "../../../shared/services/user.service";
import {GameHistory} from "../../../shared/interfaces/gameHistory";
import {User} from "../../../shared/interfaces/user";

@Component({
  selector: 'app-game-histories-modal',
  templateUrl: './game-histories-modal.component.html',
  styleUrls: ['./game-histories-modal.component.scss']
})
export class GameHistoriesModalComponent implements OnInit {
  gameHistories: GameHistory[] = []
  user!: User
  isEmpty: boolean = false
  isLoading: boolean = true
  notScroll: boolean = true
  notEmptyHistories: boolean = true
  paginationLoading: boolean = false

  constructor(private auth: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.auth.currentUser
    this.getGameHistories()
  }

  getGameHistories() {
    this.userService.getGameHistory(this.user._id!)
      .subscribe(gameHistories => {
        if (gameHistories.length && gameHistories) {
          this.isEmpty = false
          this.gameHistories = gameHistories
          this.isLoading = false
        } else {
          this.isLoading = false
          this.isEmpty = true
        }
      }, error => console.log(error.message))
  }

  checkForGameWithYourself(gameHistory: GameHistory): boolean {
    let counter: number = 0
    gameHistory.actions.forEach(action => {
      if (action.nickname === this.user.nickname) counter++
    })

    if (counter === gameHistory.actions.length) {
      return true
    }

    return false
  }

  onScroll() {
    if (this.notScroll && this.notEmptyHistories) {
      this.paginationLoading = true
      this.notScroll = false
      this.getNextGameHistory()
    }
  }

  getNextGameHistory() {
    this.userService.getGameHistoryChunk(this.user._id!, this.gameHistories[this.gameHistories.length - 1]._id!)
      .subscribe(gameHistoryChunk => {
        if (gameHistoryChunk.length && gameHistoryChunk) {
          this.paginationLoading = false
          this.gameHistories = this.gameHistories.concat(gameHistoryChunk)
          this.notScroll = true
        } else {
          this.paginationLoading = false
          this.notEmptyHistories = false
        }
      })
  }
}
