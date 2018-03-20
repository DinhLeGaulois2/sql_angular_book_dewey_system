import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { BookService } from '../../services/book/book.service';

import { BookModel } from '../../models/books/book.model';
import { PostModel } from '../../models/posts/post.model';

@Component({
    moduleId: module.id,
    selector: 'book-open',
    templateUrl: `./book.open.component.html`,
})
export class BookOpenComponent {
    isReadMode: boolean = true;
    activeBook: BookModel;
    postsOfActiveBook: PostModel[];

    newPost2Add: PostModel;
    addPostForm: NgForm;

    constructor(private auth: AuthService, private bookService: BookService) {
        this.bookService.getObservableActiveBook().subscribe(res => {
            this.activeBook = res;
        });

        this.newPost2Add = {
            idpost: -1,
            title: "",
            content: "",
            type: ""
        }

        this.postsOfActiveBook = [];
        this.bookService.getObservablePostsOfActiveBook().subscribe(res2 => {
            for (let i = 0; i < res2.length; i++) {
                this.postsOfActiveBook.push({
                    idpost: res2[i].idpost,
                    title: res2[i].title,
                    content: res2[i].content,
                    type: "Book" //res2[i].type
                });
            }
        });
    }

    setIsAddPost(): void {
        this.newPost2Add = {
            idpost: -1,
            title: "",
            content: "",
            type: "Book"
        }
        this.isReadMode = false;
    }

    cancelNewPost(): void { this.isReadMode = true; }

    saveNewPost(form: NgForm): void {
        this.addPostForm = form;
        var cleanedText = this.newPost2Add.content;
        cleanedText = cleanedText.replace(/'/gi, "''");
        cleanedText = cleanedText.replace(/"/gi, "'");
        this.bookService.recordPostObservable({
            title: this.newPost2Add.title,
            content: this.newPost2Add.content,
            type: this.newPost2Add.type,
            isbn: this.activeBook.isbn
        }).subscribe(response => {
            this.newPost2Add.idpost = response[0]["last_insert_id()"];
            this.postsOfActiveBook.push(this.newPost2Add);
            this.isReadMode = true;
            setTimeout(() => { form.resetForm() }, 100);
        });
    }

    deletePost(idpost: number): void {
        this.bookService.deletePostObervable(idpost).subscribe(response => {
            for (let i = 0; i < this.postsOfActiveBook.length; i++) {
                if (this.postsOfActiveBook[i].idpost == idpost) {
                    this.postsOfActiveBook.splice(i, 1);
                    return;
                }
            }
        });
    }

    isBookDefined(): boolean {
        return typeof this.activeBook == "undefined" ? false : true;
    }

    arePostsDefined(): boolean {
        return typeof this.postsOfActiveBook == "undefined" ? false : true;
    }
}