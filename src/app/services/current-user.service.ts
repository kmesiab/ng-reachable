import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { LocalStorageService } from './local-storage.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  localStorageKey = 'currentUser';

  constructor(
    private jwtService: JwtService,
    private localStorageService: LocalStorageService
    ) { }

  isLoggedIn(): boolean {
    if (this.getJwt() !== '') {
      if (this.jwtService.isExpired(this.getJwt())) {
        this.clearJwt();
        return false;
      } else {
        return true;
      }
    }

    return false;
  }

  setJwt(jwt: string): void {
    this.localStorageService.setItem('jwt', jwt);
  }

  getJwt(): string {
    const jwt: string = this.localStorageService.getItem('jwt') || '';
    return jwt.replace("\"", "");
  }

  clearJwt(): void {
    this.localStorageService.removeItem('jwt');
  }

  getUser(): User {
    return this.jwtService.getUserFromJWT(this.getJwt());
  }
}
