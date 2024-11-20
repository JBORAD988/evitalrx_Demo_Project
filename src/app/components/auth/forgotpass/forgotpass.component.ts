import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss']
})
export class ForgotpassComponent {

  ForgotpassForm!: FormGroup


  constructor(private fb: FormBuilder,
    private fireauth: AuthenticationService,
    private route: Router,
    private toastr: ToastrService) {

      this.ForgotpassForm = this.fb.group(
        {
          useremail: [ '', [Validators.required, Validators.email]],
        })



    }

    ForgotpassSentLink(){
      this.fireauth.recoverpass(this.ForgotpassForm.value.useremail)
      this.toastr.success('Reset Link Sent to Your Email');
      this.ForgotpassForm.reset();
      this.route.navigate(['auth/login']);
    }

}
