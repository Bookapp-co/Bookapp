import {Component, OnInit} from '@angular/core';
import {ThemeOptions} from '../../../../../theme-options';
import { AuthenticationService } from '../../../../../_services/authentication.service';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {

  currentUser$ : any;

  toggleDrawer() {
    this.globals.toggleDrawer = !this.globals.toggleDrawer;
  }

  constructor(public globals: ThemeOptions, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
  }

}
