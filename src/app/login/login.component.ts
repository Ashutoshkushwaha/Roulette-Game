import { Component } from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {Router} from '@angular/router';
import {IUser} from '../user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user: IUser = null;
  check = false;
  constructor(private _apiService: ApiHandlerService, private _router: Router) { }

  Authenticate(uniqueId: string) {
      this._apiService.getUser(uniqueId)
        .subscribe(user => {
          this.user = user;
          console.log(this.user);
          if (this.user.Unique_User_Id != null) {
            sessionStorage.setItem('currentUser', JSON.stringify(this.user));
            this._router.navigate(['/game']);
            location.reload();
          } else {
            this.check = true;
          }
        });
  }


}
