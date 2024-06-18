import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { StoreComponent } from './store/store.component';
import { MemberComponent } from './member/member.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'store', component: StoreComponent },
  { path: 'member', component: MemberComponent },
  { path: 'profile', component: ProfileEditComponent },
  { path: '**', redirectTo: '' ,}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
