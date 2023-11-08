import {Component, OnInit} from '@angular/core'
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {InAppBrowserObject} from "@awesome-cordova-plugins/in-app-browser";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public browser?: InAppBrowserObject
  public browser2?: InAppBrowserObject

  constructor(
    private inAppBrowser: InAppBrowser) {}

  ngOnInit() {}

  async openWebview() {
    this.browser = this.inAppBrowser.create(
      'https://www.luxair.lu/information-light/hpmobile',
      '_blank',
      {
        fullscreen: 'yes',
        hidenavigationbuttons: 'yes',
        hideurlbar: 'yes',
        presentationstyle: 'fullscreen',
        toolbar: 'no',
      });

    this.browser.on('loadstop').subscribe((event) => {
      if(!this.browser) return

      setTimeout(() => {
        this.browser2 = this.inAppBrowser.create(
          'https://bookingconnector.luxair.lu/booking?origin=LUX&destination=LCY&from=2024-01-01&to=2024-01-31&tripType=2&adult=1&student=0&youth=0&children=0&infant=0&lang=en&site=LUXAIR',
          '_blank',
          'location=yes,presentationstyle=formsheet,toolbarposition=top,fullscreen=yes,hideurlbar=yes,toolbarcolor=#176bff,closebuttoncolor=#ffffff,navigationbuttoncolor=#ffffff'
        );

        this.browser2.on('loadstop').subscribe(event => {
          if(!this.browser2) return

          this.browser2.insertCSS({ code: '.header-text {color: red !important;}' });

        });
      }, 5000)
    })
  }
}
