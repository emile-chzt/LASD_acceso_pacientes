// inject ngRoute for all our routing needs
 angular.module('routerRoutes', ['ngRoute'])

// configure our routes
 .config(function($routeProvider, $locationProvider) {
 $routeProvider
 .when('/', {
    templateUrl : 'views/login.html',
    controller : 'loginController'
    })
.when('/patient', {
    templateUrl : 'views/patientData.html',
    controller : 'patientController'
    })
       


// set our app up to have pretty URLS
 $locationProvider.html5Mode(true);
 });

 