import angular=require("angular");
import { AppComponent } from '../app.component';
import {setAngularJSGlobal,downgradeComponent} from '@angular/upgrade/static';

setAngularJSGlobal(angular);

const app=angular.module('heroApp', []);
app.controller('MainCtrl', function() {
  this.message = 'Angular js Hello world';
});


app.directive(
  'appRoot',
  downgradeComponent({ component: AppComponent }) as angular.IDirectiveFactory
);
