var app =  angular.module('main-App',['ngRoute','angularUtils.directives.dirPagination']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/AngularUploadImage/home.html',
                controller: 'AdminController'
            }).
            when('/articles', {
                templateUrl: '/AngularUploadImage/articles.html',
                controller: 'ArticlesController'
            }).
            when('/galleries', {
                templateUrl: '/AngularUploadImage/galleries.html',
                controller: 'GalleriesController'
            });
}]);
