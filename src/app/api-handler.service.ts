import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {IUser} from './user';
import 'rxjs/add/operator/do';

@Injectable()
export class ApiHandlerService {

  user: IUser;
  private _apiUrl = 'http://localhost:62985/api/User';
  constructor(private _http: HttpClient ) { }

  getUser(id: string): Observable<IUser> {
    return this._http.get<IUser>(this._apiUrl + '/GetUser?id=' + id );

  }
  blockAmount (id: string, amount: number ): Observable <IUser> {
    return this._http.put<IUser>(this._apiUrl + '/BlockAmount?id=' + id + '&amount=' + amount, this.user )
      .do(data => console.log('All data:' + JSON.stringify(data)));
  }
  modifyAmount(id: string, factor: number): Observable<IUser> {
    return this._http.put<IUser>( this._apiUrl + '/ModifyAmount?id=' + id + '&factor=' + factor, this.user)
      .do(data => console.log('All' + JSON.stringify(data)));
  }
}
