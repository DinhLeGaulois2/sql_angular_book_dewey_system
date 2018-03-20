import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { LibraryService } from '../../services/library/library.service';

import { BookService } from '../../services/book/book.service';

import { Observable } from 'rxjs/Observable';

import {BookModel} from '../../models/books/book.model';

@Component({
    moduleId: module.id,
    selector: 'book-add',
    templateUrl: `./book.add.component.html`,
})
export class BookAddComponent {
    isbn: string = "";

    dataFromAPIs: BookModel;

    isEnterISBN: boolean = true;

    isGoodISBNFormat: boolean = false;

    constructor(private auth: AuthService, private libService: LibraryService, private router:Router, private bookService:BookService) {  
    }

    initData(): void {
        this.dataFromAPIs = {
            isbn: "",
            title: "",
            authors: [],
            sub_div: "",
            url: "",
            edition: "",
            publisher_name: "",
            dewey_code: -1,
            dewey_name: "",
        };
    }

    newISBN(): void {
        this.initData();
        this.getDataFromISBN();
    }

    tryISBNAgain(): void {
        this.initData();
        this.isEnterISBN = true;
        this.isbn = "";
    }

    isDataDefined(): boolean {
        return typeof this.dataFromAPIs != 'undefined';
    }

    recordBookData(): void {
        this.bookService.record_book();
        
        this.router.navigate(['/book/open']);
    }

    getDataFromISBN(): void {
        this.isEnterISBN = true;
        this.isGoodISBNFormat = false;
        // clean up operations ....
        // delete the '-' sign
        this.isbn = this.isbn.replace(/-/g, "");
        // delete spaces        
        this.isbn = this.isbn.replace(/\s*/g, "");
        var len = this.isbn.length;
        if ((len == 10) || (len == 13)) {
            this.isGoodISBNFormat = true;
            this.isEnterISBN = false;
            this.bookService.request2Apis(this.isbn).subscribe(response => {
                if (typeof response.isbndb.error == 'undefined') {
                    var pointOpenLib = "ISBN:" + this.isbn; 
                    var isbndbStart = response.isbndb.data[0];
                    var openLibStart = response.openlib[pointOpenLib];

                    // Get the formal ISBN
                    var isbn = isbndbStart.isbn13;
                    if (isbn == "undefined")
                        isbn = openLibStart.isbn_10;

                    // Get Title
                    var title = isbndbStart.title_latin;
                    if (title == "undefined")
                        title = openLibStart.title;

                    // Get Authors
                    var authors = [];
                    for (let i = 0; i < isbndbStart.author_data.length; i++) {
                        authors.push(isbndbStart.author_data[i].name);
                    }
                    if (authors.length == 0) {
                        for (let i = 0; i < openLibStart.authors.length; i++) {
                            authors.push(isbndbStart.authors[i].name);
                        }
                    }

                    var publisher_name = isbndbStart.publisher_name;
                    if (publisher_name == "undefined")
                        publisher_name = openLibStart.publishers[0];

                    var edition = isbndbStart.edition_info;

                    var dewey_code = isbndbStart.dewey_normal;
                    if (dewey_code.length == 0)
                        dewey_code = openLibStart.dewey_decimal_class;
                    if (dewey_code.length > 0) {
                        // we don't need to much detail about the code because
                        // librarians don't agree with each others about sub-divisions
                        dewey_code = dewey_code.split("/")[0];                        
                        dewey_code = dewey_code.split(".")[0];
                    }

                    this.dataFromAPIs = {
                        isbn: isbn,
                        title: title,
                        authors: authors,
                        sub_div:"",
                        url:"",
                        edition: edition,
                        publisher_name: publisher_name,
                        dewey_code: dewey_code,
                        dewey_name: "",
                    };

                    this.bookService.setDataFromAPIs(this.dataFromAPIs);
                }
            });
        }
        else {
            this.tryISBNAgain();
            alert("The format of an ISBN is 10 or 13 Numbers!");
        }
    }
}