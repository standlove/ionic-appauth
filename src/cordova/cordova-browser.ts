import { CordovaDocument } from './cordova-document';
import { Browser } from '../auth-browser'
import { SafariViewController } from '@ionic-native/safari-view-controller'
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser'
import { IAuthConfig } from '../auth-configuration';

// REQUIRES CORDOVA PLUGINS
// cordova-plugin-safariviewcontroller
// cordova-plugin-customurlscheme
// cordova-plugin-inappbrowser FROM https://github.com/Onegini/cordova-plugin-inappbrowser.git
declare let window: any;
export class CordovaBrowser extends Browser {

    private inAppBrowserRef : InAppBrowserObject | undefined;
    private isInAppBrowser: boolean = false;

    public async  closeWindow(): Promise<void> {
        await CordovaDocument.ready();

        if(await SafariViewController.isAvailable() && !this.isInAppBrowser){
            try{SafariViewController.hide(); }catch{}  
        }else{
            if(this.inAppBrowserRef != undefined)
                this.inAppBrowserRef.close(); 
        } 
    }

    public async showWindow(url: string, callback?: string, authConfig?: IAuthConfig) : Promise<string | undefined> {
        await CordovaDocument.ready();
        this.isInAppBrowser = authConfig && authConfig.inAppBrowser;

        if(await SafariViewController.isAvailable() && !this.isInAppBrowser){
            let optionSafari: any = {
                url: url,    
                showDefaultShareMenuItem: false,
                toolbarColor: '#ffffff'
            }
            SafariViewController.show(optionSafari).subscribe((result : any) => {
                if (result.event === 'closed') {
                   this.onCloseFunction();
                }
            });
        }else{
            authConfig.inAppBrowser = {
                ...authConfig.inAppBrowser, zoom: 'no',
                clearcache: authConfig.inAppBrowser.clearcache || 'no',
                clearsessioncache: authConfig.inAppBrowser.clearsessioncache || 'no',
                hideurlbar: authConfig.inAppBrowser.hideurlbar || 'yes',
                toolbarposition: authConfig.inAppBrowser.toolbarposition || 'top',
                location: window.device && window.device.platform === 'iOS' ? 'no' : 'yes',
                lefttoright: window.device && window.device.platform === 'iOS' ? 'no' : 'yes',
                usewkwebview: authConfig.inAppBrowser.usewkwebview || 'yes'
            };
    
            this.inAppBrowserRef = InAppBrowser.create(url, '_blank', authConfig.inAppBrowser);
            if (this.inAppBrowserRef !== undefined) {
                this.inAppBrowserRef.on('loadstart').subscribe(e => {
                    if (e.url.includes(authConfig.redirect_url) || e.url.includes(authConfig.end_session_redirect_url)) {
                        this.inAppBrowserRef.close();
                        InAppBrowser.create(e.url.replace('http://', ''), '_system');
                    }
                });
                this.inAppBrowserRef.on('exit').subscribe(() => this.onCloseFunction());
            }
        
        }
        return;
    }
        
       
}