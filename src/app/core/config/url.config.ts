import { environment } from 'src/environments/environment';

export const API = {
  //BASE_URL: "http://opencart.kalanjiamhardwares.com/api/rest",
  BASE_URL: environment.base_url,
  OAUTH_TOKEN: "/oauth2/token/client_credentials"
};

export const AUTH = 'Basic c2hvcHBpbmdfb2F1dGhfY2xpZW50OnNob3BwaW5nX29hdXRoX3NlY3JldA==';
