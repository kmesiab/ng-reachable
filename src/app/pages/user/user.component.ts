import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RoundOffsets } from '@popperjs/core/lib/modifiers/computeStyles';
import { CurrentUserService } from 'app/services/current-user.service';
import { UserService } from 'app/services/user-service.service';
import { Router } from '@angular/router';
import { AccountStatus, User } from 'app/services/user-service.types';
import { HttpResponse } from '@angular/common/http';
import { JwtService } from 'app/services/jwt.service';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
})

export class UserComponent implements OnInit{

    user: User;
    errorMessage: string = "";
    updateMessage: string = "";

    constructor(
        private router: Router,
        private userService: UserService,
        private currentUserService: CurrentUserService
    ){}

    ngOnInit(): void {

        this.errorMessage = "";
        this.updateMessage = "";
        
        if (!this.currentUserService.isLoggedIn()) {
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
        this.updateMessage = "";
    }

    signOut(): void {
        this.currentUserService.clearJwt();
        this.router.navigate(['/login']);
        return;
    }

    updateProfile(): void {


        this.user.password = null;
        this.userService.update(this.user).subscribe(
            (response: HttpResponse<any>) => this.handleUpdateResponse(response),
            (error: any) => this.showErrorMessage(error)
        )

    }

    handleUpdateResponse(response: HttpResponse<any>): void {

        if (response.status === 200) {
            this.currentUserService.setJwt(response.body.data.token)
            this.updateMessage = 'Your profile has been updated.';
        } else {
            this.showErrorMessage(new Error(response.body.message));
        }

    }

    showErrorMessage(error: any): void {
        this.errorMessage = error.message;
    }

    showUpdateMessage(msg: string) {
        this.updateMessage = msg;
    }
    
}
