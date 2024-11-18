import { Injectable } from '@angular/core';
import { from, Observable, of } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any;


    constructor(private authfire: AngularFireAuth, private route: Router, private firestore: AngularFirestore) { }


  signIn(params: SignIn): Observable<any> {

    return from(this.authfire.signInWithEmailAndPassword(
      params.email, params.password
    )).pipe(
      tap(()=>{

        setTimeout(()=>{

          console.log('You have been successfully logged in');
          this.route.navigate(['/pages/dashboard']);
        },2000)
      }, error => {

        console.log("Invalid Email or Password");
      })
    )
    }













  async signup(user:SignUp) {
    try {
      const userCredential = await this.authfire.createUserWithEmailAndPassword(user.Email, user.password);
      const userId = userCredential.user?.uid;

      if (userId) {
        await this.firestore.collection('users').doc(userId).set({
          email: user.Email,
        });
        console.log('User document created successfully!');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  }


  sendtoken() {
    const length = 32
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@~#$%^&*()_+|}{:;<>?';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    localStorage.setItem("token", token)

  }
  setemailtoken(email: any) {
    localStorage.setItem("id", email)
  }

  signout() {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    this.route.navigate(['login'])


  }

  deleteUser(uid: any) {
    console.log(uid)
  }


  recoverpass(email: string): Observable<void> {
    return from(this.authfire.sendPasswordResetEmail(email)).pipe(tap(()=>{
      setTimeout(()=>{
        console.log('Email has been sent to your email address')
        this.route.navigate(['login'])
      },2000)
    }))
  }


  AuthLogin(provider: any) {
    return this.authfire
      .signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!', result.user);
        return result.user;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  get IsLoggedIn() {
    if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  }


}

type SignIn = {
  email: string; password: string;
}
type SignUp = {
  Email: string; password: string;
}
