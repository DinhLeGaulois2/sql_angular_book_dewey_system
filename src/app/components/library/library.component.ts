import { Component } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { LibraryService } from '../../services/library/library.service';

import { LibDeweyDivModel } from '../../models/library/lib.dewey_div.model';

import { LibraryDivisionComponent } from './library.division.component';

@Component({
  moduleId: module.id,
  selector: 'library-search',
  templateUrl: `./library.component.html`,
})
export class LibrarySearchComponent {
  dewey2By2Struct: any;

  isGeneralInterface: boolean = true;

  constructor(private auth: AuthService,
    private libService: LibraryService,
    private router: Router
  ) {
      this.libService.getDeweyObservable().subscribe(res => {
        this.libService.setDeweyStructure(res);
        this.dewey2By2Struct = this.libService.getStructByTwo();
        this.router.navigate(['/library']);
      });
  }

  setSubDivCode(iddewey: number): void {
    this.libService.setSubDivDeweyNumber(iddewey);
    this.isGeneralInterface = false;
    this.router.navigate(['/library/division']);
  }
}