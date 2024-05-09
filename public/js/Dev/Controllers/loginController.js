// users page specific controller
MyApp.controller('loginController', function($scope,$window, $http, $location,Patient) {

    $scope.doLogin = function() {

        Patient.login($scope.username, $scope.password)
            .success(function(data) {
    
                if(data.success==true){
                    $scope.errorLogin=0;
                    $window.localStorage.setItem('PatientID', data.patientId);
                    $location.path('/patient');
    
                }else if(data.success==false){
                    $scope.errorLogin=1;
                }
    
            });
    };
    
});

