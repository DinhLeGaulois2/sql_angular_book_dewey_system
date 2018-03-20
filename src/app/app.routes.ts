import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// >>>>>>>>>>>>>>> Books >>>>>>>>>>>>>>>
import { BookAddComponent } from './components/book/book.add.component';
import { BookOpenComponent } from './components/book/book.open.component';
//<<<<<<<<<<<<<<< End Quiz <<<<<<<<<<<<<

// >>>>>>>>>> About Home >>>>>>>>>>
import { Home } from './components/home/home.component';
// <<<<<<<<<< End of About Home <<<<<<<<<<

//>>>>>>>>>>>>>>> Library >>>>>>>>>>>>>>>
import { LibrarySearchComponent } from './components/library/library.component';
import { LibraryDivisionComponent } from './components/library/library.division.component';
//<<<<<<<<<<<<<<< End Quiz <<<<<<<<<<<<<

import {AuthGuard} from './auth.guard';

const appRoutes: Routes = [
    {
        path: '',
        component: Home, 
        pathMatch: 'full'
    },
    {   
        path:'book/add',
        component:BookAddComponent,
        canActivate:[AuthGuard],
        pathMatch: 'full'
    },
    {   
        path:'book/open',
        component:BookOpenComponent,
        canActivate:[AuthGuard],
        pathMatch: 'full'
    },
    {   
        path:'library',
        component:LibrarySearchComponent,
        canActivate:[AuthGuard],
        pathMatch: 'full'
    },
    {   
        path:'library/division',
        component:LibraryDivisionComponent,
        canActivate:[AuthGuard],
        pathMatch: 'full'
    }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);