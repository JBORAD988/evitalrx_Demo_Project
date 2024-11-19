import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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


  constructor(private fb: FormBuilder, private fireauth: AuthenticationService, private router: Router, private fireStore: FirestoreService , private toastr: ToastrService ){
    this.signUpForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

    this.toastr.success('User Created Successfully');

    this.signUpForm.reset();
    this.router.navigate(['auth/login']);
  }



}
