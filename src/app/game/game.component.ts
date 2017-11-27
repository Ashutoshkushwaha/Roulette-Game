import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {IUser} from '../user';
import {ApiHandlerService} from '../api-handler.service';
import {IWinningDetails} from './details';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  visibleModal = true;
  winningAmount = 0;
  check = true;
  valid = null;
  success = true;
  resultFactor = 0;
  exitConfirm: boolean;
  randomNumber: number;
  currentUser: IUser = {
    'Customer_Name': '',
    'Contact_Number': null,
    'Email_Id': '',
    'Account_Balance': null,
    'Blocked_Amount': null,
    'Unique_User_Id': ''
  }

  winningDetails =  {
    'one': {
      maxi: 12,
      mini: 1,
      factor: 1.5
    },
    'two': {
      maxi: 24,
      mini: 13,
      factor: 1.5
    },
    'three': {
      maxi: 36,
      mini: 25,
      factor: 1.5
    },
    'four': {
      maxi: 0,
      mini: 0,
      factor: 10
    },
    'five': {
      maxi: 18,
      mini: 1,
      factor: 1.25
    },
    'six': {
      maxi: 36,
      mini: 19,
      factor: 1.25
    },
    'seven': {
      factor: 1.25
    },
    'eight': {
      factor: 1.25
    },
  };

  constructor(private _route: Router, private  _apiHandler: ApiHandlerService) {
     this.randomNumber = Math.floor(Math.random() * 37) + 0;

  }
  bettingAmount = 0;
  previousId = '';
  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  }

  InRange(max: number, min: number, givenNumber: number): boolean {
    return givenNumber <= Math.max(max, min) && givenNumber >= Math.min(max, min);
  }
  Result (id: string): number {
    if (id === 'seven') {
       if (this.randomNumber !== 0 && (this.randomNumber % 2 === 0)) {
         return this.winningDetails.seven.factor;
       }
    } else if (id === 'eight') {
      if (this.randomNumber !== 0 && (this.randomNumber % 2 !== 0)) {
        return this.winningDetails.eight.factor;
      }
    } else if (id === 'four') {
      if (this.randomNumber === 0) {
        return this.winningDetails.four.factor;
      }
    } else {
      if (this.InRange(this.winningDetails[id].maxi, this.winningDetails[id].mini, this.randomNumber )) {
        return this.winningDetails[id].factor;
      }
    }
    return 0;
  }

  Betting(id: string, value: number) {
    if (this.previousId === '') {
      this.previousId = id;
      this.bettingAmount = value;
    }else if (this.previousId === id) {
      this.bettingAmount = value;
    } else {
      if (this.previousId !== id  && ( value !== 0)) {
        window.alert('Select one betting range');
        location.reload();
      }
    }
    console.log(this.bettingAmount);
  }

  Confirm() {
    if (!this.bettingAmount || this.bettingAmount === 0 || (this.bettingAmount % 500 !== 0)) {
      this.valid = false;
    } else {
      this.valid = true;
    }
  }

  GenerateRandomNumber(): number {
    return Math.floor(Math.random() * 37) + 0;
  }

  LogOut(): void {
    this.exitConfirm = window.confirm('Are you sure you want to exit?')
    if (this.exitConfirm) {
      this.check = false;
      sessionStorage.removeItem('currentUser');
      this._route.navigate(['/login']);
    }
    location.reload();
  }

  BlockAmount(): void {
    if (this.currentUser.Account_Balance < this.bettingAmount) {
      this.success = false;
    }else {
      this._apiHandler.blockAmount(this.currentUser.Unique_User_Id, this.bettingAmount)
        .subscribe(user => {
          this.currentUser = user;
          sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          console.log(user);
          this.visibleModal = false;
          if (this.randomNumber && this.randomNumber >= 0) {
            console.log('The id is ' + this.previousId + typeof(this.previousId));
            this.resultFactor = this.Result(this.previousId);
            console.log('The factor is ' + this.resultFactor);
            this.winningAmount = this.resultFactor * this.currentUser.Blocked_Amount;
            this._apiHandler.modifyAmount(this.currentUser.Unique_User_Id, this.resultFactor)
              .subscribe(data => {
                this.currentUser = data;
                sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                console.log(data);
              });
          }
        });
    }
  }

  ResetGame(): void {
    location.reload();
  }

  PlayAgain(): void {
    this._apiHandler.getUser(this.currentUser.Unique_User_Id)
      .subscribe(user => {
        this.currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      });
    location.reload();

  }

}
