import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'app/services/current-user.service';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'app/models/user';
import { AccountStatus } from 'app/models/account-status'
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
})

export class UserComponent implements OnInit{

    user: User;
    errorMessage: string = "";
    updateMessage: string = "";
    updatingUserInfo = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private currentUserService: CurrentUserService
    ){
        this.user = this.currentUserService.getUser()
    }

    ngOnInit(): void {

        this.errorMessage = "";
        this.updateMessage = "";
        
        if (!this.currentUserService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }

        if (this.user !== null && this.user.accountStatusId !== AccountStatus.ACTIVE) {
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

        this.updatingUserInfo = true
        this.user.password = null;
        this.userService.update(this.user).subscribe(
            (response: HttpResponse<any>) => this.handleUpdateResponse(response),
            (error: any) => this.showErrorMessage(error)
        )
    }

    handleUpdateResponse(response: HttpResponse<any>): void {
        
        this.updatingUserInfo = false;
        
        if (response.status === 200) {
            this.currentUserService.setJwt(response.body.data.token)
            this.updateMessage = 'Your profile has been updated.';
        } else {
            this.showErrorMessage(new Error(response.body.message));
        }
    }

    showErrorMessage(error: any): void {
        this.updatingUserInfo = false;
        this.errorMessage = error.message;
    }

    showUpdateMessage(msg: string) {
        this.updateMessage = msg;
    }
    
}
