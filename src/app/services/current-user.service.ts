import { Injectable } from '@angular/core';
import { AccountStatus, User, mapStatusIdToString } from './user-service.types';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  localStorageKey = 'currentUser';

  constructor(private localStorageService: LocalStorageService) { }


  setLoggedIn(user: User, jwt: string): void {
    this.setUser(user)
    this.setJwt(jwt)
  }

  setLoggedOut(): void {
    this.clearUser()
    this.clearJwt()
  }

  isLoggedIn(): boolean {
    return this.getJwt() !== null;
  }

  setJwt(jwt: string): void {
    this.localStorageService.setItem('jwt', jwt);
  }

  getJwt(): User | null {
    return this.localStorageService.getItem('jwt');
  }

  clearJwt(): void {
    this.localStorageService.removeItem('jwt');
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
}
