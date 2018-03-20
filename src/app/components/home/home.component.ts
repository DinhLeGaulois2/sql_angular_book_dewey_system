import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: `./home.component.html`,
})
export class Home {

  constructor(private auth:AuthService){
    
  }
}
