import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent {
  uploadForm: FormGroup;
  images: any[] = [];
  serverName = 'http://localhost:3000';

  userData = {
    name: '',
    avatar: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private route: ActivatedRoute
  ) {
    this.uploadForm = new FormGroup({
      file: new FormControl(null),
      description: new FormControl(''),
      category: new FormControl(''),
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      console.log('Token', token);
      if (token) {
        this.decodeToken(token);
        localStorage.setItem('token', token);
        this.router.navigate(['/store']);
      }
    });
  
  }

  decodeToken(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.userData.name = decodedToken.name;
    console.log('decodedToken', decodedToken);
    if (decodedToken.id) {
      this.userData.avatar = `http://localhost:3000/avatar?id=${decodedToken.id}`;
    } else {
      this.userData.avatar = decodedToken.avatar;
    }

    localStorage.setItem('user_id', decodedToken.user_id);
    console.log('Decoded token', decodedToken);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileControl = this.uploadForm.get('file');
      if (fileControl) {
        fileControl.setValue(file);
      }
    }
  }

  getImages() {
    const queryParam = `user_id=${localStorage.getItem('user_id')}`;
    this.http.get(`${this.serverName}/images?${queryParam}`).subscribe(
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

  onSubmit() {
    const formData = new FormData();
    const fileControl = this.uploadForm.get('file');
    const descriptionControl = this.uploadForm.get('description');
    const categoryControl = this.uploadForm.get('category');

    if (fileControl && descriptionControl && categoryControl) {
      formData.append('file', fileControl.value);
      formData.append('description', descriptionControl.value);
      formData.append('category', categoryControl.value);

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      formData.append('user_id', userId);

      console.log(formData.get('file'));
      console.log(formData.get('description'));

      this.http.post(`${this.serverName}/upload`, formData).subscribe(
        (response) => {
          console.log('Upload response', response);
          this.getImages();
        },
        (error) => console.error('Upload error', error)
      );
    }
  }

  logout() {
    localStorage.removeItem('user_id');
    this.router.navigate(['/']);
  }
}
