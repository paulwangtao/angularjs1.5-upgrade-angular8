# angularjs1.5-upgrade-angular8
angularJs1.5和angular8混合应用开发

第一步 先搭建 简单的angular1.5 项目，

传统项目目录：
mkdir demo & cde demo
demo -
     - ./src/index.html
     - ./src/assets/js/angular.js   //version 1.5 
     - ./src/assets/js/app.module.js //controller
-- src/index.html 文件
 <!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>demo</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body > 
    <div id="message" ng-controller="MainCtrl as mainCtrl">
      {{ mainCtrl.message }}
    </div>

<script src="assets/js/angular.min.js" type="text/javascript"></script>
<script src="assets/js/app.module.js" type="text/javascript"></script>

</body>
</html>

-- src/assets/js/app.module.js

var app = angular.module('heroApp', []);
app.controller('MainCtrl', function () {
    this.message = 'Hello world';
});

angular.element(document).ready(function() {
     angular.bootstrap(document.body, ["heroApp"]);
});

第一阶段完成  本地运行 
在demo 下暂时加入start.js  node start

-- src/start.js
var PORT = 3000;

var http = require('http');
var url=require('url');
var fs=require('fs');
var path=require('path');
var mine = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};
var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log(pathname);
    if (pathname.charAt(pathname.length - 1) == "/") {
            //如果访问目录
            pathname += "index.html"; //指定为默认网页
        }

    var realPath = path.join(".", pathname);
    var ext = path.extname(realPath);
    
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

-- 第二步 引入angular8，前提anguar cli 和npm等已经安装；

两种方式 一种：在demo文件夹下 ng new angular方式， 
        二：基于现有目录改造；
我拷贝了ng工程下已 angular.json,browserslist,karma.config.js,package-lock.json,.package.json,tsconfig.app.json,tsconfig.json,tsconfig.spec.json,tslint.json 拷贝9个文件 

如果这时候 ng serve 回报错缺少main.ts
拷贝 ng工程下main.ts,polyfills.ts,styles.css文件和environments文件夹
执行命令：ng generate component app  --module=main

目录结构 
src --
       app--app.module.ts,app.component.ts,app.component.html,app.component.css,app.component.spec.ts
       apgularjs 文件夹 app.component.ts
       main.ts
       index.html

关键文件代码：

-- src/index.html

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>demo</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body > 
    <div id="message" ng-controller="MainCtrl as mainCtrl">
      {{ mainCtrl.message }}
    </div>

    <app-root>loading</app-root>

<!-- <script src="assets/js/angular.min.js" type="text/javascript"></script> -->
<!-- <script src="assets/js/app.module.js" type="text/javascript"></script> -->

</body>
</html>

-- src/main.js

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UpgradeModule ,setAngularJSGlobal,downgradeComponent} from '@angular/upgrade/static';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
//import * as angular from './assets/js/angular.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
 .catch(err => console.error(err));

-- src\app\app.module.ts

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

-- src\app\angularjs\app.module.ts
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


--  关键引用
1.  npm install @angular/upgrade --save-dev  //官方升级组件
2.  npm i angular@1.7.6 --save               //去掉index.html的angular.min.js应用改为typescript 方式引用

执行：ng serve  至此 anguarjs已经可以和angular8 兼容了，恭喜你

参考文献：https://angular.cn/guide/upgrade 官网给出了参考

        https://www.cnblogs.com/sghy/p/9150346.html  很有参考价值，但从传统模式看这篇文章至少我当时还有很多疑惑，且不太适用最新版本，
        我卡在  const m = angular.module('AngularJsModule', []); 在ts中引用会存在问题



希望本人能帮助大家升级应用有所有帮助
wangtaovipone@sina.com 阿paul




--
