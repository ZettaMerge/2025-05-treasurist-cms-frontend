// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'https://treasurist-trade-cms-qas.azurewebsites.net',
  tokenUrl: 'https://treasurist-trade-cms-qas.azurewebsites.net/auth',
  loginScreenUrl: 'http://localhost:4200/auth/login',
  storagePrefix: 'treasurist-cms-',
  // imagePrefixUrl: 'https://treasurist-trade-cms-qas.azurewebsites.net/',
  bankFix: 'SCB 1113990849',
};
