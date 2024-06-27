import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for animations
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { StoreComponent } from './store/store.component';
import { MemberComponent } from './member/member.component';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { JwtModule } from '@auth0/angular-jwt';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { MenuComponent } from './menu/menu.component';
import { ImageModalComponent } from './image-modal/image-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    StoreComponent,
    MemberComponent,
    ProfileEditComponent,
    MenuComponent,
    ImageModalComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
