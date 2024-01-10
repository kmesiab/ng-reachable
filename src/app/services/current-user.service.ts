import { Injectable } from '@angular/core';
import { User } from './user-service.types';
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
    return this.getJwt() !== '';
  }

  setJwt(jwt: string): void {
    this.localStorageService.setItem('jwt', jwt);
  }

  getJwt(): string {
    return this.localStorageService.getItem('jwt') || '';
  }

  clearJwt(): void {
    this.localStorageService.removeItem('jwt');
  }

  getUser(): User | null {
    return this.jwtService.getUserFromJWT(this.getJwt());
  }
}
