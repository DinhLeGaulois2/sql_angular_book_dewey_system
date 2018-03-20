import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
// import * as auth0 from 'auth0-js';
import 'rxjs/add/operator/filter';

let Auth0Lock = require('auth0-lock').default;

@Injectable()
export class AuthService {
  lock = new Auth0Lock('50qgOyUE8IqiZblBTztKQjqh9oHgBnnm', 'dinh-hu.auth0.com');

  constructor(public router: Router) {
    // Add callback for lock 'authenticated' event
    this.lock.on("authenticated", (authResult: any) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          this.setSession(authResult);
          this.router.navigate(['/']);
        }
    });
  }

  public login(): void {
    this.lock.show();
  }

  private setSession(authResult: any): void {
    // Set the time that the access token will expire at
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public authenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return tokenNotExpired('id_token');
  }

}
