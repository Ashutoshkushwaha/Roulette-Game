import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {ApiHandlerService} from './api-handler.service';
import { GameComponent } from './game/game.component';
import { NavbarComponent } from './navbar/navbar.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent},
      {path: 'game', component: GameComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '**', component: LoginComponent}
    ])
  ],
  providers: [ApiHandlerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
