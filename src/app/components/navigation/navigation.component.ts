import { Component, OnInit } from '@angular/core';
import {GameHistoriesModalComponent} from "../modals/game-histories-modal/game-histories-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../pages/auth/auth.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout()
  }

  openGameHistories() {
    this.dialog.open(GameHistoriesModalComponent)
  }

}
