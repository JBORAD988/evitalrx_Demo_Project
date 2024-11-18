import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { FirestoreService } from 'src/app/Services/firebaseDatabase/firestore.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signUpForm!: FormGroup;

  type: string = "password"
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash'


  constructor(private fb: FormBuilder, private fireauth: AuthenticationService, private router: Router, private fireStore: FirestoreService  ){
    this.signUpForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.required  ],
      password: ['', Validators.required],
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password"

  }

  onSingup() {

    this.fireauth.signup({
      Email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    })


    console.log({detail: "SUCCESS", summary: "User Created Successfully ", duration: 5000});
    this.signUpForm.reset();
    this.router.navigate(['auth/login']);
  }



}
