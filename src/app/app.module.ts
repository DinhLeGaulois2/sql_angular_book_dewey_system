import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';
// <<<<<<<<<< End of About Quiz <<<<<<<<<<

import { LibraryService } from './services/library/library.service';
import { BookService } from './services/book/book.service';

// >>>>>>>>>> About Home >>>>>>>>>>
import { Home } from './components/home/home.component';
// <<<<<<<<<< End of About Home <<<<<<<<<<

// >>>>>>>>>> About Books >>>>>>>>>>
import { BookOpenComponent } from './components/book/book.open.component';
import { BookAddComponent } from './components/book/book.add.component';
// <<<<<<<<<< End of About Books <<<<<<<<<<

// >>>>>>>>>> About Library >>>>>>>>>>
import { LibrarySearchComponent } from './components/library/library.component';
import { LibraryDivisionComponent } from './components/library/library.division.component';
// <<<<<<<<<< End of About Library <<<<<<<<<<


@NgModule({
  imports: [BrowserModule, routes, FormsModule, HttpModule],
  declarations: [AppComponent,

    // >>>>>>>>>> About Books >>>>>>>>>>
    BookOpenComponent,
    BookAddComponent,
    // <<<<<<<<<< End of About Books <<<<<<<<<<
    
    // >>>>>>>>>> About Home >>>>>>>>>>
    Home,
    // <<<<<<<<<< End of About Home <<<<<<<<<<

    // >>>>>>>>>> About Library >>>>>>>>>>
    LibrarySearchComponent,
    LibraryDivisionComponent
    // <<<<<<<<<< End of About Library <<<<<<<<<<
  ],
  providers: [
    LibraryService,
    BookService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
