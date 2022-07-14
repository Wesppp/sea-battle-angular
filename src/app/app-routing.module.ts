import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "./pages/game/game.component";
import {LoginPageComponent} from "./pages/auth/login-page/login-page.component";
import {AuthGuard} from "./pages/auth/auth.guard";
import {LoggedInGuard} from "./pages/auth/logged-in.guard";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent, canActivate: [LoggedInGuard]},
  {path: 'game', component: GameComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
