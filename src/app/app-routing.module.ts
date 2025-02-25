import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoutingService } from 'src/core/services/routing.service';

const routes: Routes = [

  // {
  //   path: '',
  //   redirectTo: 'start',
  //   pathMatch: 'full'
  // },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/add/add.module').then(m => m.AddPageModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./pages/tasks/tasks.module').then(m => m.TasksPageModule),
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then(m => m.StartPageModule)
  },
  {
    path: 'details/:id',
    loadChildren: () => import('./pages/details/details.module').then(m => m.DetailsPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.EditPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'country',
    loadChildren: () => import('./pages/country/country.module').then(m => m.CountryPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
