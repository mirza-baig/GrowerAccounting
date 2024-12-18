import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {LicenseManager} from '@ag-grid-enterprise/core';

// Set the license key for AG Grid
LicenseManager.setLicenseKey(environment.agGridLicenseKey);


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
