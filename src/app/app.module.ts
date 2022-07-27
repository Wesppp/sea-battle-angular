import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from "@angular/common";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './pages/game/game.component';
import { PlayerFieldComponent } from './components/player-field/player-field.component';
import { OpponentFieldComponent } from './components/opponent-field/opponent-field.component';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { GameHistoriesModalComponent } from './components/modals/game-histories-modal/game-histories-modal.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import { CustomRegistrationModalComponent } from './components/modals/custom-registration-modal/custom-registration-modal.component';
import { LayoutModule } from "@angular/cdk/layout";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ChatComponent } from './components/chat/chat.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { InsertingKeyModalComponent } from './components/modals/inserting-key-modal/inserting-key-modal.component';
import { GameKeyComponent } from './components/modals/game-key-modal/game-key.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PlayerFieldComponent,
    OpponentFieldComponent,
    LoginPageComponent,
    GameHistoriesModalComponent,
    ProgressSpinnerComponent,
    CustomRegistrationModalComponent,
    ChatComponent,
    NavigationComponent,
    InsertingKeyModalComponent,
    GameKeyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatButtonModule,
    DragDropModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    LayoutModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
