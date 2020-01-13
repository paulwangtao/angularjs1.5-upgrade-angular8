
var app = angular.module('heroApp', []);
app.controller('MainCtrl', function () {
    this.message = 'Hello world';
});

angular.element(document).ready(function() {
     angular.bootstrap(document.body, ["heroApp"]);
});
