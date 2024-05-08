import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  @ViewChild('authForm') authForm!: NgForm;
  constructor(private router: Router, private http: HttpClient) { }

  isLogin = true;
  serverName = 'http://localhost:3000';  

  toggleForm() {
    this.isLogin = !this.isLogin;  
  }

  onLogin() {
    const formValue = this.authForm.value;
    this.http.post(`${this.serverName}/login`, formValue).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          console.log('Login successful', response);
          this.router.navigate(['/member']);
          localStorage.setItem('user_id', response['id']);
          return;
        } else {
          console.error('Login failed', response);
        }
      }),
      (error: any) => console.error(error);
  }

  onRegister() {
    const formValue = this.authForm.value;
    this.http.post(`${this.serverName}/register`, formValue).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          console.log('Register successful', response);
          this.router.navigate(['/member']);
          localStorage.setItem('user_id', response['id']);
          return;
        } else {
          console.error('Register failed', response);
        }
      }),
      (error: any) => console.error(error);
  }
}
