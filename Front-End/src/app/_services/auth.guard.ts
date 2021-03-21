import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;

        console.log("authguard--");
        console.log(currentUser);
        if (currentUser) {
            // logged in so return true
            return true;
        }
        console.log("authguard--end");

        // not logged in so redirect to login page with the return url
        this.router.navigate(['pages/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
