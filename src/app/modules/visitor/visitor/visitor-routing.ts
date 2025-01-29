import { Routes } from '@angular/router';
const VisitorRoutingModule: Routes = [
  {
    path: 'contact-us',
    loadChildren: () =>
      import('../contact-us/contact-us/contact-us.module').then(
        (m) => m.ContactUsModule
      )
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('../about-us/about-us.module').then(
        (m) => m.AboutUsModule
      )
  },
  {
    path: 'services',
    loadChildren: () =>
      import('../services/services.module').then(
        (m) => m.ServicesModule
      )
  },
  {
    path: 'privacy-policy',
    pathMatch: 'prefix',

    loadChildren: () =>
      import('../privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      )
  },
  {
    path: 'cancel-policy',
    pathMatch: 'prefix',

    loadChildren: () =>
      import('../cancellation/cancellation.module').then(
        (m) => m.CancellationModule
      )
  },
  {
    path: 'terms-policy',
    pathMatch: 'prefix',

    loadChildren: () =>
      import('../terms/terms.module').then(
        (m) => m.TermsModule
      )
  },
  {
    path: 'questions',
    loadChildren: () =>
      import('../common-questions/common-questions.module').then(
        (m) => m.CommonQuestionsModule
      )
  },
  {
    path: 'packages',
    loadChildren: () =>
      import('../packages/packages.module').then(
        (m) => m.PackagesModule
      )
  },
]
export { VisitorRoutingModule };
