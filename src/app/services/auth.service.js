"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var angular2_jwt_1 = require("angular2-jwt");
// import * as auth0 from 'auth0-js';
require("rxjs/add/operator/filter");
var Auth = (function () {
    function Auth(router) {
        var _this = this;
        this.router = router;
        this.lock = new Auth0Lock('50qgOyUE8IqiZblBTztKQjqh9oHgBnnm', 'dinh-hu.auth0.com');
        // Add callback for lock 'authenticated' event
        this.lock.on("authenticated", function (authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                _this.setSession(authResult);
                _this.router.navigate(['/']);
            }
        });
    }
    Auth.prototype.login = function () {
        this.lock.show();
    };
    Auth.prototype.setSession = function (authResult) {
        // Set the time that the access token will expire at
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
    };
    Auth.prototype.logout = function () {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        // Go back to the home route
        this.router.navigate(['/']);
    };
    Auth.prototype.authenticated = function () {
        // Check whether the current time is past the
        // access token's expiry time
        return angular2_jwt_1.tokenNotExpired('id_token');
    };
    return Auth;
}());
Auth = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router])
], Auth);
exports.Auth = Auth;
//# sourceMappingURL=auth.service.js.map