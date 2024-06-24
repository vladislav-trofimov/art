import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent {

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService ) {
    this.uploadForm = new FormGroup({
      file: new FormControl(null),
      description: new FormControl(''),
      category: new FormControl(''),
    });
    this.uploadFormUser = new FormGroup({
      file: new FormControl(null),
    });
  }

  visible = false;

  uploadForm: FormGroup;
  uploadFormUser: FormGroup;

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
    this.getImages();
  }

  getImages() {
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
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    console.log('Selected file', this.selectedFile);
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

  async onSubmitUser() {

    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    formData.append('user_id', userId);
    console.log(formData.get('file'));

    const base64Image = await this.convertFileToBase64( this.selectedFile);
    console.log('Base64 image', base64Image);

    this.http.post(`${this.serverName}/upload-user`, {avatar: base64Image, userId}).subscribe(
      (response: any) => {
        console.log('Upload response', response);
        if (response && response['token']) {
          localStorage.setItem('token', response['token']);
          const decodedToken = this.jwtHelper.decodeToken(response['token']);
          this.userData.name = decodedToken.name;
          this.userData.userId = decodedToken.user_id;
          console.log('decodedToken', decodedToken);
          if (decodedToken.id) {
            this.userData.avatar = `http://localhost:3000/avatar?id=${decodedToken.id}`;
          } else {
            this.userData.avatar = decodedToken.avatar;
          }
        }
        this.getImages();
      },
      (error) => console.error('Upload error', error)
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

  onOpen() {
    this.visible = true;
  }

  onClose() {
    this.visible = false;
  }
}
