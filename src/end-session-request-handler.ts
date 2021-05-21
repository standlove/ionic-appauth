import { EndSessionRequest } from './end-session-request';
import { AuthorizationServiceConfiguration, StringMap, BasicQueryStringUtils } from "@openid/appauth";
import { Browser } from './auth-browser'
import { IAuthConfig } from './auth-configuration';

export interface EndSessionHandler {
  performEndSessionRequest(configuration: AuthorizationServiceConfiguration, request : EndSessionRequest, authConfig?: IAuthConfig): Promise<string | undefined>;
}

export class IonicEndSessionHandler implements EndSessionHandler {

    constructor(  
        private browser: Browser,
        private utils = new BasicQueryStringUtils()  
        ) {}

    public async performEndSessionRequest(configuration: AuthorizationServiceConfiguration, request : EndSessionRequest, authConfig?: IAuthConfig): Promise<string | undefined> {
      let url = this.buildRequestUrl(configuration, request);
      return this.browser.showWindow(url, request.postLogoutRedirectURI, authConfig); 
    }

    private buildRequestUrl(configuration: AuthorizationServiceConfiguration,request: EndSessionRequest) {
      let requestMap: StringMap = {
        'id_token_hint': request.idTokenHint,
        'post_logout_redirect_uri': request.postLogoutRedirectURI,
        'state': request.state,
      };
  
      let query = this.utils.stringify(requestMap);
      let baseUrl = configuration.endSessionEndpoint;
      let url = `${baseUrl}?${query}`;
      return url;
    }
}