import { Routes } from '@angular/router';
import { GitHubDemoComponent } from './github-demo/github-demo.component';

export const routes: Routes = [
  { path: 'github-demo', component: GitHubDemoComponent },
  { path: '', redirectTo: '/github-demo', pathMatch: 'full' }
];
