import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent {

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService ) { }

  profile = {
    name: '',
    oldPassword: '',
    newPassword: ''
  };

  userData = {
    name: '',
    avatar: '',
    userId: 0
  };

  images: any[] = [];
  serverName = 'http://localhost:3000';

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

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

    this.http.get(`${this.serverName}/images?user_id=${this.userData.userId}`).subscribe(
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

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.previewUrl = reader.result;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }
  


  onSubmit() {
    if (this.selectedFile) {
      console.log('File selected:', this.selectedFile.name);
    }
    console.log('Profile updated:', this.profile);
  }
}
