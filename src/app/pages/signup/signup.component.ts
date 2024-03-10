import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import { User, AccountStatus, mapStatusIdToString } from "../../services/user-service.types";
import { UserService } from "../../services/user-service.service";
import { CurrentUserService } from "../../services/current-user.service";
import { OtpService } from "../../services/otp-service.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PhoneService } from "app/services/phone.service";

@Component({
  selector: "app-signup",
  standalone: true,
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class SignupComponent {
  
  email = "";
  lastname = "";
  firstname = "";
  phoneNumber = "";
  errorMessage = "";
  password = "";
  password2 = "";

  constructor(
    private router: Router,
    private phoneService: PhoneService,
    private userService: UserService,
    private otpService: OtpService,
    private currentUserService: CurrentUserService,
  ) { }

  ngOnInit(): void {
    if (this.currentUserService.isLoggedIn()) {

      let u = this.currentUserService.getUser();

      if (u.accountStatusId === AccountStatus.ACTIVE) {
        this.router.navigate(["/profile/user"]);
        return;
      };

      this.phoneNumber = u.phone_number;
      this.firstname = u.firstname;
      this.lastname = u.lastname
      this.email = u.email;
    }
    
  }

  // Method to handle user signup
  signup() {

    this.errorMessage = "";

    // validate the form
    if (!this.validateFormFields()) {
      return;
    }

    // create and validate a user from the form fields
    const newUser = this.createUser();
    if (!this.areRequiredFieldsFilled(newUser)) {
      return;
    }

    // normalize and verify the provided phone number
    let normalizedPhoneNumber = this.getNormalizedPhoneNumber(newUser);
    if (normalizedPhoneNumber === '') {
      return;
    }

    newUser.phone_number = normalizedPhoneNumber;

    // See if this user exists
    this.userService.getUserByIdOrPhoneNumber(newUser.phone_number).subscribe((user: User) => {
        if (user !== null) {

          this.processExistingUser(user);
          return;

        } else {

          this.processNewUser(newUser);
          return;
        }
      },
      (error) => this.handleGetUserError(error, newUser)
    );
  }


  // Attempt to send OTP after successful signup
  private attemptSendOtp(user: User) {

    this.otpService.sendOtp(user.phone_number).subscribe(
      (response: HttpResponse<any>) => this.handleOtpResponse(response),
      (error: any) => this.handleSendOtpError(error, user)
    );
  }

  private processNewUser(newUser: User) {
    this.userService.signup(newUser).subscribe(
      (response) => this.handleSignupResponse(response, newUser),
      (error) => this.handleSignupError(error, newUser)
    );
  }

  // A user with this phone number already exists
  // so we need to check if it is in a state we can
  // attempt to activate.
  private processExistingUser(user: User) {

    switch (user.accountStatusId) {
      case AccountStatus.PENDING_ACTIVATION:
        // resend the OTP for this phone number
        this.attemptSendOtp(user);
        return;
      case AccountStatus.SUSPENDED:
        this.errorMessage = "This account is suspended. Contact support.";
        return;
      case AccountStatus.EXPIRED:
        // consider resending the OTP for expired accounts
        this.errorMessage = "This account is expired. Contact support.";
        return;
      default:
        this.errorMessage =
          "A user with this phone number already exists.";
        return;
    }
  }

  // Create a new user from the form fields
  private createUser(): User {
    return {
      id: 0,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      phone_number: this.phoneNumber,
      password: this.password,
      accountVerified: false,
      accountStatusId: AccountStatus.PENDING_ACTIVATION,
      accountStatus: mapStatusIdToString(AccountStatus.PENDING_ACTIVATION),
    };
  }

  // Check if all required fields are filled
  private areRequiredFieldsFilled(user: User): boolean {
    for (let key in user) {
      if (user[key as keyof User] === "") {
        this.errorMessage = `${key} is required`;
        return false;
      }
    }
    return true;
  }


  validateFormFields(): boolean {
    

    if (this.password.trim() === "") {
      this.errorMessage = "Please enter a password";
      return;
    }

    if (this.password.trim() !== this.password2.trim()) {
      this.errorMessage = "Passwords do not match";
      return;
    }

    let normalizedPhoneNumber = this.phoneService.normalizePhoneNumber(this.phoneNumber);

    if (normalizedPhoneNumber === '') {
      this.errorMessage = 'Invalid phone number.';
      return;
    }

    return true;
  }

  getNormalizedPhoneNumber(newUser: User): string {

    let normalizedPhoneNumber = this.phoneService.normalizePhoneNumber(this.phoneNumber);

    if (normalizedPhoneNumber === '') {
      this.errorMessage = 'Invalid phone number.';
      return "";
    }

    newUser.phone_number = normalizedPhoneNumber;

    if (newUser.phone_number === "") {
      this.errorMessage = "Invalid phone number.";
      return "";
    }

    return normalizedPhoneNumber;

  }

  // Handle the response of the signup process
  private handleSignupResponse(response: HttpResponse<any>, user: User) {
    if (response.status === 201) {
      console.log("Created user: ", user)
      this.attemptSendOtp(user);
    } else {
      console.log('signup error');
      this.errorMessage = response.body.message;
    }
  }

  // Handle OTP service response
  private handleOtpResponse(response: HttpResponse<any>) {
    if (response.status === 200) {
      this.router.navigate(["/otp"]);
    } else {
      this.errorMessage = response.body.message;
    }
  }

  // Something failed when trying to send an OTP
  private handleSendOtpError(error: any, user: User) {
    this.errorMessage = error.message;
  }

  private handleSignupError(response: any, newUser: User) {
       // Something went wrong lookup up the user
       console.group("An error occurred during the signup", response);
       this.errorMessage = response.error.message;
  }

  // Handle errors when checking for an existing user.
  // If this error returns a 404, the user doesn't exist
  // and we can safely create it.
  private handleGetUserError(response: any, newUser: User) {

    // The user doesn't exist.  Using new user flow
    if (response.status === 404) {
    
      this.processNewUser(newUser);
      return;
    }

    // Something went wrong looking up the user
    console.error("An error occurred looking to see if this user exists already", response);
    this.errorMessage = response.body;
  }
}