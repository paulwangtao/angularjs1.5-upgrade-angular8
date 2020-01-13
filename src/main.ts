import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UpgradeModule ,setAngularJSGlobal,downgradeComponent} from '@angular/upgrade/static';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
//import * as angular from './assets/js/angular.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
 .catch(err => console.error(err));

