import { provideRouter, RouterConfig }  from "@angular/router";

import { LoginComponent } from "./Login/login.component";
import { RegisterComponent } from "./Register/register.component";
import { HomeComponent } from "./Home/home.component";
import { ProfileComponent } from "./Profile/profile.component";
import { ImagesComponent } from "./Images/images.component";
import { GroupsComponent } from "./Groups/groups.component";
import { UploadImageComponent } from "./UploadImage/uploadimage.component";

import { AuthGuard } from "./Shared/auth-guard.service";
import { InverseAuthGuard } from "./Shared/inverse-auth-guard.service";

const routes: RouterConfig = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [InverseAuthGuard]
    },
    {
        path: "register",
        component: RegisterComponent,
        canActivate: [InverseAuthGuard]
    },
    {
        path: "home",
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            { path: "", component: ImagesComponent },
            { path: "profile", component: ProfileComponent },
            { path: "imagelist", component: ImagesComponent },
            { path: "groups", component: GroupsComponent },
            { path: "upload", component: UploadImageComponent }
        ]
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];