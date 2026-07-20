import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{
		path: 'login',
		loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent)
	},
	{
		path: 'home',
		canActivate: [authGuard],
		loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
	},
	{
		path: 'dashboard',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'verify',
		canActivate: [authGuard],
		loadComponent: () => import('./features/verify/verify.component').then((m) => m.VerifyComponent)
	},
	{
		path: 'results',
		canActivate: [authGuard],
		loadComponent: () => import('./features/results/results.component').then((m) => m.ResultsComponent)
	},
	{
		path: 'history',
		canActivate: [authGuard],
		loadComponent: () => import('./features/history/history.component').then((m) => m.HistoryComponent)
	},
	{
		path: 'reports',
		canActivate: [authGuard],
		loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent)
	},
	{
		path: 'profile',
		canActivate: [authGuard],
		loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent)
	},
	{ path: '**', redirectTo: 'login' }
];
