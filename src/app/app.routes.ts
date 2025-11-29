import { Routes } from '@angular/router';
import { Login } from '../login/login';
import { Admin } from '../admin/admin';
export const routes: Routes = [
    
  {path: '', component: Login},
  {path: 'create', loadComponent: () => import('../createPerso/create').then(m => m.CreatePerso)},
  {path: 'lore', loadComponent: () => import('../lorePerso/lore').then(m => m.Lore)},
  {path: 'home', loadComponent: () => import('../home/home').then(m => m.Home)},
  {path: 'admin', component: Admin},
  {path: 'monsterpedia', loadComponent: () => import('../monstropedia/monstropedia').then(m => m.Monstropedia)},
  
];

