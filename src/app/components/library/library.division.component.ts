import { Component } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { LibraryService } from '../../services/library/library.service';

import { BookService } from '../../services/book/book.service';

import { BooksDivModel } from '../../models/books/books.div.model';

import { DeweyCodeNameModel } from '../../models/dewey.code-name.model';

@Component({
    moduleId: module.id,
    selector: 'library-division',
    templateUrl: `./library.division.component.html`,
})
export class LibraryDivisionComponent {
    isWholeDivision: boolean = true;
    isListNotEmpty:boolean = false;
    subDeweyDiv: BooksDivModel = null;

    constructor(private auth: AuthService,
            private libService: LibraryService,
            private router: Router,
            private bookService: BookService) {
        var obj = this.libService.getSubDivDeweyNumber()
        this.libService.getDivSubStructObservable().subscribe(res => {
            this.subDeweyDiv = {
                dewey_code: obj.dewey_code,
                dewey_name: obj.dewey_name,
                books: res
            }
            this.isListNotEmpty = true;
        });
    }

    addOrExplore(isbn: string): void {
        this.isWholeDivision = false;
        this.bookService.setActiveIsbn(isbn);
        this.router.navigate(['/book/open']);
    }
}