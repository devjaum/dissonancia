import { Routes } from '@angular/router';
import { Login } from '../login/login';
export const routes: Routes = [
    
  {path: '', component: Login},
  {path: 'create', loadComponent: () => import('../createPerso/create').then(m => m.CreatePerso)},
  {path: 'lore', loadComponent: () => import('../lorePerso/lore').then(m => m.Lore)}
  
];

