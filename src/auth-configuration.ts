import { InAppBrowserOptions } from "@ionic-native/in-app-browser";

export enum AuthenticationType {
    Token = "token",
    AuthorizationCode = "code",
    IdToken = "id_token"
}

export interface IAuthConfig {
    client_id: string,
    server_host: string,
    redirect_url: string, 
    end_session_redirect_url: string, 
    scopes: string,
    pkce : boolean,
    inAppBrowser?: any;
}