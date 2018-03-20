import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LibraryService } from './services/library/library.service';

@Component({
  selector: 'my-app',
  templateUrl: `./app.component.html`,
})
export class AppComponent {

  constructor(private auth: AuthService, private libService: LibraryService) {
  }

  refreshPage(): void {
    this.libService.setDeweyObservable();
    this.libService.getDeweyObservable().subscribe(res => {
      this.libService.setDeweyStructure(res);
    });
    window.location.reload();
  }
}
