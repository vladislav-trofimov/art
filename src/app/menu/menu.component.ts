import { Component, Output, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Output() selectArts: EventEmitter<any> = new EventEmitter();

  categories = [
    {id: 1, name: 'Modern'},
    {id: 2, name: 'Classic'},
    {id: 3, name: 'Anime'},
    {id: 4, name: 'Custom'},
    {id: 0, name: 'All'}
  ];

  userData = {
    name: '',
    avatar: '',
    userId: 0
  };

  constructor(private jwtHelper: JwtHelperService, private router: Router) { }

  onSelectionChange(event: any) {
    console.log(event);
    this.selectArts.emit(event);
  }

  myWorks() {
    console.log('My works', this.userData.userId);
    if (!this.userData.userId) {
      return
    }
    this.selectArts.emit({user_id: this.userData.userId});
  }

  logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  profile() {
    this.router.navigate(['/profile']);
  
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if(!token){
      return
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.userData.name = decodedToken.name;
    this.userData.userId = decodedToken.user_id;
    console.log('decodedToken', decodedToken);
    if (decodedToken.id) {
      this.userData.avatar = `http://localhost:3000/avatar?id=${decodedToken.id}`;
    } else {
      this.userData.avatar = decodedToken.avatar;
    }

    console.log('token', token);
    console.log('User data', this.userData);
  }
}
