import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RoundOffsets } from '@popperjs/core/lib/modifiers/computeStyles';
import { CurrentUserService } from 'app/services/current-user.service';
import { UserService } from 'app/services/user-service.service';
import { Router } from '@angular/router';
import { AccountStatus, User } from 'app/services/user-service.types';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
})

export class UserComponent implements OnInit{

    user: User;
    errorMessage: string = "";

    constructor(
        private router: Router,
        private userService: UserService,
        private currentUserService: CurrentUserService
    ){}

    ngOnInit(): void {
        
        if (!this.currentUserService.isSet()) {
            this.router.navigate(['/login']);
            return;
        }

        this.user = this.currentUserService.getUser()

        if (this.user.accountStatusId !== AccountStatus.ACTIVE) {
            this.router.navigate(['/login']);
            return;
        }

    }

    closeWarning(): void {
        this.errorMessage = "";
    }

    signOut(): void {
        this.currentUserService.clearUser();
        this.router.navigate(['/login']);
        return;
    }

    updateProfile(): void {

        this.userService.update(this.user).subscribe(
            (response: HttpResponse<any>) => this.handleUpdateResponse(response),
            (error: any) => this.handleError(error)
        )

    }

    handleUpdateResponse(response: HttpResponse<any>): void {

        if (response.status === 200) {
            this.currentUserService.setUser(this.user);
        } else {
            this.handleError(new Error(response.body.message));
        }

    }

    handleError(error: any): void {
        this.errorMessage = error.message;
    }
    
}
