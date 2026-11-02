import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { FeedComponent } from './features/feed/feed.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { isAllowedAuthGuard } from './core/auth/guards/is-allowed-auth-guard';
import { alreadyLoggedGuard } from './core/auth/guards/already-logged-guard';
import { MyFeedComponent } from './features/feed/components/my-feed/my-feed.component';
import { MyPostsComponent } from './features/feed/components/my-posts/my-posts.component';
import { CommunityComponent } from './features/feed/components/community/community.component';
import { SavedComponent } from './features/feed/components/saved/saved.component';
import { ChangePassComponent } from './features/change-pass/change-pass.component';
import { PostDetailsComponent } from './post-details/post-details.component';

export const routes: Routes = [
{path :"" ,redirectTo :"login" , pathMatch :"full"},
{path :"", canActivate:[alreadyLoggedGuard],component :AuthLayoutComponent , children : [
{path : "login" , component : LoginComponent},
{path : "register" , component : RegisterComponent}
]},
{path :"",canActivate:[isAllowedAuthGuard] ,component :MainLayoutComponent , children :[
{path : "feed" , component :FeedComponent , 
    children : [
    
        {path :"" , component :MyFeedComponent},
        {path :"my-posts" , component :MyPostsComponent},
        {path :"community" , component :CommunityComponent},
{path :"saved" , component :SavedComponent},
]},
{path : "profile" , component :ProfileComponent},
{path : "notifications" , component :NotificationsComponent},
{path : "change-pass" , component :ChangePassComponent},
{path : "posts/:postId" , component :PostDetailsComponent},
]},
{path :"**" , component :NotFoundComponent}
];
