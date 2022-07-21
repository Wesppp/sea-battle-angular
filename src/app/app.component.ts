import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./pages/auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sea-battle-angular';

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.checkLoginStatus()
  }
}
