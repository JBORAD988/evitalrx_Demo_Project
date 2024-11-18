import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { SharedStatusService } from 'src/app/Services/shared-status.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  type: string = "password"
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash'
  visibility: Boolean = true;

  isLogginIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private fireauth: AuthenticationService,
    private route: Router,
    private sharedDataService: SharedStatusService,

  ) {}



  ngOnInit(): void {

    this.loginForm = this.fb.group({
      username: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    })

    this.visibility = false ;

  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password"

  }


  toggleEyeIconVisibility() {
       this.visibility =  true ;
  }




  onSubmit() {

    this.isLogginIn = true
    this.fireauth.signIn({
      email: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).subscribe(async () => {
      this.fireauth.sendtoken()
      console.log('Logged In Successfully! ');
      this.sharedDataService.setLoginStatus(true);
      this.route.navigate(['/']);
    }, error => {
      this.isLogginIn = false
      this.route.navigate(['/auth/login']);
    })
    console.log('register')


  }



}
