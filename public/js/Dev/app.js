var MyApp = angular.module('LabApp', ['ui.bootstrap','patientService','routerRoutes',"googlechart"])

MyApp.controller('mainController', function($scope,Patient,$location,$window) {

    if($window.localStorage.getItem('PatientID')){
        $location.path('/patient');
    }else{
        $location.path('/');
    }
    

});
