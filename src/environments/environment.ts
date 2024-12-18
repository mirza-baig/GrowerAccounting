// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  version: '1.0.0',
  buildName: 'Local',
  production: false,
  // apiUrl: 'https://sql_test:10910/api',

  // Tom.  This is the deployed version on test
  // apiUrl: 'https://sql_test.fieldale.com:10910/api',
  apiUrl: 'https://localhost:44305/api',
  externalApiUrl: 'https://workflow.fieldale.com:1446/api',
  isStepperLinear: true, // todo: set to false before PR
  versionCheckURL: '../../dist/GrowerAccounting/version.json',
  // userManagementApiUrl: 'https://sql_test.fieldale.com:10010/api',
  // userManagementApiUrl: 'https://webserv2.fieldale.com:448/api',
  // https://sql_test.fieldale.com:10010/
  userManagementApiUrl: 'https://localhost:44390/api',
  breederSettlementApiUrl: 'https://sql_test.fieldale.com:11310/api',
  appId: 35,
  // tslint:disable-next-line:max-line-length
  agGridLicenseKey: 'Fieldale_Farms_Corporation_Fieldale_Multiple_Applications_2_Devs_1_Deployment_License_17_January_2021_[v2]_MTYxMDg0MTYwMDAwMA==a5988fff1639c64d8e8024780a764cd6',
  bypassUserManagement: false,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

/* alternate URLs
http://localhost:2829/api
https://webserv2.fieldale.com:446/api
https://apcapx.azurewebsites.net/api

*/
