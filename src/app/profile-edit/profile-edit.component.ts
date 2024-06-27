import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.uploadForm = new FormGroup({
      file: new FormControl(null),
      description: new FormControl(''),
      category: new FormControl(''),
    });

    this.profileForm = new FormGroup({
      file: new FormControl(null),
      name: new FormControl('', Validators.required),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
  }

  visible = false;

  uploadForm: FormGroup;
  profileForm: FormGroup;

  userData = {
    name: '',
    avatar: '',
    userId: 0
  };

  images: any[] = [];
  serverName = 'http://localhost:3000';

  selectedFile: File | null = null;

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.userData.name = decodedToken.name;
    this.userData.userId = decodedToken.user_id;
    this.userData.avatar = decodedToken.avatar ? decodedToken.avatar : `http://localhost:3000/avatar?id=${decodedToken.user_id}`;
    this.getImages();
  }

  getImages() {
    this.http.get(`${this.serverName}/images?user_id=${this.userData.userId}`).subscribe(
      (response: any) => {
        this.images = response.map((image: any) => ({
          ...image,
          url: `${this.serverName}/${image.file_path}`
        }));
      },
      (error) => console.error('Request failed', error)
    );
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

  onFileChangeUser(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
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

      this.http.post(`${this.serverName}/upload`, formData).subscribe(
        (response) => {
          this.getImages();
        },
        (error) => console.error('Upload error', error)
      );
    }
  }

  async onSubmitUser() {
    if (!this.profileForm.valid) {
      console.error('Form is invalid');
      return;
    }

    const nameControl = this.profileForm.get('name');
    const newPasswordControl = this.profileForm.get('newPassword');
    const confirmPasswordControl = this.profileForm.get('confirmPassword');

    if (newPasswordControl?.value !== confirmPasswordControl?.value) {
      console.error('Passwords do not match');
      return;
    }

    const formData: any = {
      name: nameControl?.value,
    };

    if (newPasswordControl?.value) {
      formData.newPassword = newPasswordControl.value;
    }

    if (this.selectedFile) {
      formData.avatar = await this.convertFileToBase64(this.selectedFile);
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    formData.userId = userId;

    this.http.post(`${this.serverName}/update-profile`, formData).subscribe(
      (response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          const decodedToken = this.jwtHelper.decodeToken(response.token);
          this.userData.name = decodedToken.name;
          this.userData.avatar = decodedToken.avatar ? decodedToken.avatar : `http://localhost:3000/avatar?id=${decodedToken.user_id}`;
        }
      },
      (error) => console.error('Update error', error)
    );
  }

  async convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

