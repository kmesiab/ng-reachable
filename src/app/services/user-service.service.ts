import { Injectable } from '@angular/core';
import { User, AccountStatus, mapStatusNameToAccountStatus } from './user-service.types';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://fng90w0hv0.execute-api.us-west-2.amazonaws.com/dev';

  constructor(private http: HttpClient) { }
  
  getUserByIdOrPhoneNumber(id: string): Observable<User> {
    return this.http.get<any>(`${this.baseUrl}/users/${id}`).pipe(
      map(apiData => this.mapApiDataToUser(apiData))
    );
  }


  signup(user: User): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.baseUrl}/users`, user, {
      observe: 'response'
    });
  }

  activate(user: User): Observable<HttpResponse<any>> {
    user.accountStatusId = AccountStatus.ACTIVE;
    return this.http.put<any>(`${this.baseUrl}/users`, user, {
      observe: 'response'
    });
  }

  update(user: User): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.baseUrl}/users`, user, {
      observe: 'response'
    });
  }

  login(phoneNumber: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.baseUrl}/login`, {
      "phone_number": phoneNumber,
      "password": password
    }, {
      observe: 'response'
    });
  }
  private mapApiDataToUser(apiData: any): User {

    // Implement the mapping logic here
    return {
      id: apiData.id,
      firstname: apiData.firstname,
      lastname: apiData.lastname,
      email: apiData.email,
      phone_number: apiData.phone_number,
      password: apiData.password,
      accountVerified: apiData.phone_verified,
      accountStatus: apiData.status,
      accountStatusId: apiData.status_id,
    };
  }

}
