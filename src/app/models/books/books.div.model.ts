import { BookModel } from './book.model'

export interface BooksDivModel {
    dewey_code: number,
    dewey_name: string,
    books: BookModel[]
}