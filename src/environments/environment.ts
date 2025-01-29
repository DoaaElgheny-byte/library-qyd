// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  appVersion: 'v8.1.6',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api',
  clientUrl: 'https://test.qyd.sa/', //test enviornment
  //  clientUrl: 'http://localhost:4200/', //test local
  // clientUrl: 'https://qyd.sa/',  //production
  firebase: {
    apiKey: "AIzaSyCkFIYy1N61K1Hk9zp7poHotaKmn-f4KDA",
    authDomain: "qydd-1d692.firebaseapp.com",
    projectId: "qydd-1d692",
    storageBucket: "qydd-1d692.appspot.com",
    messagingSenderId: "358319826999",
    appId: "1:358319826999:web:558a6fa4d5fcf19ed6f7b2",
    measurementId: "G-HQC6E5QT94"
  },
  api_url: 'https://api.test.qyd.sa/', //test enviornment
  // api_url: 'https://localhost:44370/',
  // api_url: 'https://dev-api-qyd.azurewebsites.net/', // local
  // api_url: 'https://api.qyd.sa/', //for production
  BlobUrl: "https://storage.googleapis.com/qyd-test/",
  appThemeName: 'Metronic',
  appPurchaseUrl: 'https://1.envato.market/EA4JP',
  appHTMLIntegration:
    'https://preview.keenthemes.com/metronic8/lilac/documentation/base/helpers/flex-layouts.html',
  appPreviewUrl: 'https://preview.keenthemes.com/metronic8/angular/lilac/',
  appPreviewAngularUrl:
    'https://preview.keenthemes.com/metronic8/angular/lilac',
  appPreviewDocsUrl: 'https://preview.keenthemes.com/metronic8/angular/docs',
  appPreviewChangelogUrl:
    'https://preview.keenthemes.com/metronic8/angular/docs/changelog',
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'deepmerge',
  },
};
/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
