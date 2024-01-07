import { Injectable } from '@angular/core';
import { AccountStatus, User, mapStatusIdToString } from './user-service.types';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  localStorageKey = 'currentUser';

  constructor(private localStorageService: LocalStorageService) { }

  isSet(): boolean {
    return !!this.getUser();
  }

  setUser(user: User) {
    user.password = "<REDACTED>";
    this.localStorageService.setItem(this.localStorageKey, user);
  }

  getUser(): User | null {
    return this.localStorageService.getItem(this.localStorageKey);
  }

  clearUser() {
    this.localStorageService.removeItem(this.localStorageKey);
  }



  getFakeUser(): User {
    return {
      id: 0,
      firstname: 'Dummy',
      lastname: 'User',
      email: 'fake-user@gmail.com',
      phone_number: '+12533243071',
      accountVerified: true,
      password: 'fake_password',
      accountStatusId: AccountStatus.ACTIVE,
      accountStatus: mapStatusIdToString(AccountStatus.ACTIVE),
    };
  }
}
