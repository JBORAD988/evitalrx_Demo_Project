import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';

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
  uid:string = ''


  constructor(private fb: FormBuilder, private fireauth: AuthenticationService, private router: Router){
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

    this.fireauth.signUp({
      Email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    }).subscribe((userCredential)=>{
      this.uid = userCredential.user.uid;
      localStorage.setItem('uid',this.uid);
      console.log({detail: "SUCCESS", summary: "User Created Successfully ", duration: 5000});
      this.signUpForm.reset();
      this.router.navigate(['/auth/login']);


    }, error => {
      console.error(error);
      console.log({detail: "Error", summary: error.message, duration: 5000});
    });
  }



}
