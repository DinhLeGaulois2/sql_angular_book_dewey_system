import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { BookModel } from '../../models/books/book.model';
import { PostModel } from '../../models/posts/post.model';

@Injectable()
export class BookService {
    lastAdded: string = "";

    activeIsbn: string = "";

    dataFromAPIs: BookModel;

    constructor(private _http: Http) { }

    setActiveIsbn(isbn: string): void {
        this.activeIsbn = isbn;
    }

    deletePostObervable(idpost): Observable<String> {
        return this._http.delete("/api/post/delete/" + idpost).map(res => res.json());
    }

    getObservableActiveBook(): Observable<BookModel> {
        return this._http.get("/api/book/" + this.activeIsbn).map(res => res.json());
    }

    getObservablePostsOfActiveBook(): Observable<PostModel[]> {
        return this._http.get("/api/posts/" + this.activeIsbn).map(res => res.json());
    }

    recordPostObservable(data: any): Observable<any> {
        return this._http.post("/api/post/add", data).map(res => res.json());
    }

    record_book(): void {
        var code = this.dataFromAPIs.dewey_code;

        let data = {
            isbn: this.dataFromAPIs.isbn,
            title: this.dataFromAPIs.title,
            authors: this.dataFromAPIs.authors,
            sub_div: this.dataFromAPIs.sub_div,
            url: this.dataFromAPIs.url,
            edition: this.dataFromAPIs.edition,
            publisher_name: this.dataFromAPIs.publisher_name,
            dewey_code: code,
            dewey_name: "",
        };

        this._http.post("/api/book/add", data).subscribe();
    }

    setDataFromAPIs(data: BookModel): void {
        this.dataFromAPIs = data;
    }

    // getLastAddedBook(): BookModel { return this.dataFromAPIs; }

    // getDeweyNameFromCode(num: number): string {
    //     for (let i = 0; i < this.deweyStruct.length; i++) {
    //         if (this.deweyStruct[i].dewey_code == num)
    //             return this.deweyStruct[i].dewey_name;
    //     }
    //     return "";
    // }

    request2Apis(isbn: string): Observable<any> {
        var url = "/api/book/isbndb-openLib/" + isbn;
        return this._http.get(url).map(res => res.json());
    }
}