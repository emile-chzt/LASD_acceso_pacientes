// users page specific controller
MyApp.controller('patientController', function($scope,$window, $http, $location,Patient) {
	$scope.logout=function(){

		$window.localStorage.removeItem('PatientID');
		$location.path('/');

	};

	$scope.tabLabel = "Listado";

	$scope.toggleView = function() {
		if ($scope.showGraph === 0) {
			$scope.showGraph = 1;
			$scope.tabLabel = "Listado";
		} else {
			$scope.showGraph = 0;
			$scope.tabLabel = "Gráfico";
		}
	};

    $scope.addWeight=0;
	$scope.showGraph=1;
    $scope.PatientID=$window.localStorage.getItem('PatientID');

    Patient.Weights($scope.PatientID)
    .success(function(data) {

        $scope.weightsList=data;
       
	    $scope.myChartObject = {};
	    $scope.myChartObject.type = "ColumnChart";

	    $scope.weights=[];

        for(i=0;i<data.length;i++){

	        $scope.aux={c: [
	            {v: data[i].FECHA_ALTER},
	            {v: data[i].PESO},
	        ]};

	        $scope.weights.push($scope.aux);
        }

	    $scope.myChartObject.data = {"cols": [
	        {id: "t", label: "Día", type: "string"},
	        {id: "s", label: "Peso", type: "number"}
	    ], "rows": 
	    	$scope.weights
	    };

	    $scope.myChartObject.options = {
	        'title': 'Histórico de Pesos'
	    };

    });



});
