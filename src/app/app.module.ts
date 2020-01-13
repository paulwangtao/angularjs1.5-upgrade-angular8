import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { UpgradeModule } from '@angular/upgrade/static';
import  "./angularjs/app.module";


@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ]
  ,declarations:[AppComponent]
  ,entryComponents:[AppComponent]
  , bootstrap: [] //
})


export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  ngDoBootstrap() {
    this.upgrade.bootstrap(document.body, ['heroApp'], { strictDi: true });
  }
}

