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
  public testMessage? = 'my orginal value'
  public testMessage2? = ''
  public webviewState: any

  constructor(
    private inAppBrowser: InAppBrowser) {}

  ngOnInit() {
  }

  async openWebview() {

    this.browser = this.inAppBrowser.create(
      'https://www.luxair.lu/information-light/hpmobile',
      '_self',
      {
        location: 'no',
        fullscreen: 'no',
        hidenavigationbuttons: 'yes',
        hideurlbar: 'yes',
        presentationstyle: 'formsheet',
        toolbar: 'no',
      });


    this.browser.on('message').subscribe(async (val)=>{
      this.testMessage = 'message was triggered'
      this.testMessage2 = JSON.stringify(val.data)

      if(val.data.goToNext) {

        this.webviewState = val.data.state

        this.openWebview2()
      }
    });

    this.browser.on('loadstop').subscribe(async (event) => {

      if(!this.browser) return

      if(typeof this.webviewState !== "undefined") {
        await this.browser.executeScript({
          code: `alert("I am receiving state from angular ${this.webviewState}")`
        })
      }

      await this.browser.insertCSS({
        code: `
          iframe { width:100%; height:100%; position: absolute; top:0; left:0; z-index: 2; opacity: 0; pointer-events: none; }
        `
      })

      await this.browser.executeScript({
        code: `
          const randomState = ${typeof this.webviewState !== "undefined" ? this.webviewState : Date.now()};

          const button = document.createElement('button');
          button.innerText = 'Custom button';

          button.addEventListener('click', () => {
              alert('i will now trigger parent to open new window and save current state: ' + randomState + ' inside the angular app');

              const data = {state: randomState, goToNext: 'true'};
              const stringifiedData = JSON.stringify(data);
              webkit.messageHandlers.cordova_iab.postMessage(stringifiedData);
          })

          const span = document.createElement('span');
          span.innerText = 'This is state ' + randomState.toString();

          document.body.appendChild(button);
          document.body.appendChild(span);
        `
      })
    })
  }

  openWebview2() {
    this.browser2 = this.inAppBrowser.create(
      'https://bookingconnector.luxair.lu/booking?origin=LUX&destination=LCY&from=2024-01-01&to=2024-01-31&tripType=2&adult=1&student=0&youth=0&children=0&infant=0&lang=en&site=LUXAIR',
      '_self',
      {
        location: 'no',
        fullscreen: 'yes',
        hidenavigationbuttons: 'yes',
        hideurlbar: 'yes',
        presentationstyle: 'fullscreen',
        toolbar: 'no',
      });

    this.browser2.on('message').subscribe((val)=>{
      if(val.data.goBack) {

        // this.browser2?.hide();

        // setTimeout(() => {
        //   alert('okay?')
        //   this.browser?.show()

        // }, 3000)

        this.openWebview()
      }
    });

    this.browser2.on('loadstop').subscribe(async (event) => {

      if(!this.browser2) return

      await this.browser2.executeScript({
        code: `
          const button = document.createElement('button');
          button.innerText = 'Go Back';
          button.addEventListener('click', () => {
            alert('i will now go back to first webview');

            const data = {goBack: 'true'};
            const stringifiedData = JSON.stringify(data);
            webkit.messageHandlers.cordova_iab.postMessage(stringifiedData);
          })

          document.body.prepend(button);
        `
      })
    })
  }

  protected readonly Object = Object;
  // protected readonly test = test;
}
