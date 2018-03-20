import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { BooksDivModel } from '../../models/books/books.div.model';
import { BookModel } from '../../models/books/book.model';
import { LibDeweyDivModel } from '../../models/library/lib.dewey_div.model';
import { DeweyCodeNameModel } from '../../models/dewey.code-name.model';

@Injectable()
export class LibraryService {
  deweyStructObservable: Observable<LibDeweyDivModel[]>;
  deweyStruct: LibDeweyDivModel[];
  subDivStruct: BooksDivModel;
  structByTwo: any;
  dewey_sub_div: number = -1;

  constructor(private _http: Http) {
    this.setDeweyObservable();
    this.deweyStruct = [];
  }

  setDeweyObservable(): void {
    this.deweyStructObservable = this._http.get("/api/dewey/all").map(res => res.json());
  }

  getDeweyObservable(): Observable<LibDeweyDivModel[]> {
    return this.deweyStructObservable;
  }

  // this method is called from 'library.component.ts'
  setDeweyStructure(ds: any): void {
    this.deweyStruct = [];
    var mainDomain = [
      "Computer science, information & general works",
      "Philosophy & Psychology",
      "Religion",
      "Social sciences",
      "Language",
      "Natural sciences & mathematics",
      "Technology",
      "Arts and Recreation",
      "Literature",
      "History and Geography"
    ];
    var code;
    // need to set data into array of 'LibDeweyDivModel'
    for (let i = 0; i < ds.length; i++) {
      code = ds[i].dewey_code;
      if (code % 100 == 0) {
        this.deweyStruct.push({
          dewey_code: code,
          dewey_name: mainDomain[code / 100],
          doc_quantity: 0,
          isMain: true
        });
        this.deweyStruct.push({
          dewey_code: ds[i].dewey_code,
          dewey_name: ds[i].dewey_name,
          doc_quantity: ds[i].doc_quantity,
          isMain: false
        });
      }
      else {
        this.deweyStruct.push({
          dewey_code: ds[i].dewey_code,
          dewey_name: ds[i].dewey_name,
          doc_quantity: ds[i].doc_quantity,
          isMain: false
        });
      }
    }

    // need to set number of document by tenth, hundredth
    var lastTenIndex = 0;
    var total_ten = 0;
    for (let i = 0; i < this.deweyStruct.length; i++) {
      code = this.deweyStruct[i].dewey_code;
      if (code % 10 == 0) {
        if (this.deweyStruct[i].isMain == false) {
          if (code == 0){
            lastTenIndex = i;
            total_ten = this.deweyStruct[i].doc_quantity;
          }
          else {
            this.deweyStruct[lastTenIndex].doc_quantity = total_ten;
            total_ten = this.deweyStruct[i].doc_quantity;
            lastTenIndex = i;
          }
        }
      }
      else
        total_ten += this.deweyStruct[i].doc_quantity;
    }
    //for the code '990'
    this.deweyStruct[lastTenIndex].doc_quantity = total_ten;
  }

  getStructByTwo(): any {
    this.setStruct2By2();
    return this.structByTwo;
  }

  setStruct2By2(): void {
    var result = [];
    var list = [];
    var oneCase = {
      title: "",
      code: -1,
      sub_div: []
    };
    var caseTitle = {};
    // As "dewey_code" in "deweyStruct" are not following each
    //    other by one unite at a time, we need to check
    //    every index because there is no (mathematical) link
    //    between the index and the "dewey_code"
    for (let i = 0; i < this.deweyStruct.length; i++) {
      let ds = this.deweyStruct[i];
      if (ds.isMain) {
        if (ds.dewey_code > 0)
          list.push(oneCase);
        oneCase = {
          title: ds.dewey_name,
          code: ds.dewey_code,
          sub_div: []
        };
      }
      else if (ds.dewey_code % 10 == 0)
        oneCase.sub_div.push(ds);
    }
    // for the last case with dewey of 990
    list.push(oneCase);

    // set double rows for table
    for (let i = 0; i < (list.length / 2); i++) {
      let doubleRow = [];
      doubleRow.push(list[i]);
      doubleRow.push(list[i + 5]);
      result.push(doubleRow);
    }
    this.structByTwo = result;
  };

  getDivSubStructObservable(): Observable<BookModel[]> {
    return this._http.get("/api/book/between-dewey/" + this.dewey_sub_div + "/" + (this.dewey_sub_div + 9)).map(res => res.json());
  }

  setSubDivDeweyNumber(code: number): void {
    this.dewey_sub_div = code;
  }

  getSubDivDeweyNumber(): DeweyCodeNameModel {
    return {
      dewey_code: this.dewey_sub_div,
      dewey_name: this.getDeweyNameFromCode(this.dewey_sub_div),
    };
  }

  getDeweyNameFromCode(dewey_code: number): string {
    var start = 0;
    var end = this.deweyStruct.length;
    var middle = Math.floor((end + start) / 2);
    for (let i = 0; i < this.deweyStruct.length; i++) {
      if (this.deweyStruct[middle].dewey_code < dewey_code) {
        // if the difference between 'end' and 'middle' is 1 then
        // 'Math.floor((start+end)/2)' will have the same 'middle'
        // and the result will be '-1' which could be wrong if
        // the result is the LAST element of the list 'deweyStruct'
        if ((end - middle) == 1) {
          if (this.deweyStruct[end].dewey_code == dewey_code)
            return this.deweyStruct[end].dewey_name;
          else return "";
        }
        start = middle;
      }
      else if (this.deweyStruct[middle].dewey_code > dewey_code)
        end = middle;
      else return this.deweyStruct[middle].dewey_name;
      middle = Math.floor((end + start) / 2);
    }
    return "";
  }
}