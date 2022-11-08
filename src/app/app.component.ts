import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hw8';
  path = '/';
  constructor(private router: Router) {
    console.log(this.router, 'router url');
    
    this.path = window.location.pathname;
    console.log(this.path);
  }



}
