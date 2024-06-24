import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent {

  constructor(private http: HttpClient,  private jwtHelper: JwtHelperService ) { }

  images: any[] = [];
  serverName = 'http://localhost:3000';

  userData = {
    name: '',
    avatar: ''
  };

  ngOnInit() {
    this.sendRequest(null);
    const token = localStorage.getItem('token');
    if(!token){
      return
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.userData.name = decodedToken.name;
    console.log('decodedToken', decodedToken);
    if (decodedToken.id) {
      this.userData.avatar = `http://localhost:3000/avatar?id=${decodedToken.id}`;
    } else {
      this.userData.avatar = decodedToken.avatar;
    }

    console.log('token', token);
    console.log('User data', this.userData);
  }

  onSelectionChange(event: MatSelectChange) {
    this.sendRequest(event.value);
  }

  handleSelectArts(event: any) {
    console.log('Selected arts', event);
    if (event.value || event.value === 0) this.sendRequest(event.value, 'category');
    if (event.user_id) this.sendRequest(event.user_id, 'user');
  }

  sendRequest(id: number | null, type: string = 'category') {
    let req = type === 'category' ? `?category_id=${id}` : `?user_id=${id}`;
    if (!id) req = '';
    this.http.get(`${this.serverName}/images${req}`).subscribe(
      (response: any) => {
        this.images = response;
        this.images = this.images.map((image) => {
          return {
            ...image,
            url: `${this.serverName}/${image.file_path}`,
          };
        });
        console.log('Images', this.images);
      },
      (error) => console.error('Request failed', error)
    );
  }
}
