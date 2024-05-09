// users page specific controller
MyApp.controller(
  "patientController",
  function ($scope, $window, $http, $location, Patient) {
    $scope.logout = function () {
      $window.localStorage.removeItem("PatientID");
      $location.path("/");
    };
    $scope.tabLabel = "Listado";

    $scope.addWeight = 0;
    $scope.showGraph = 1;
    $scope.showList = 0;
    $scope.swowAddWeight = 1;
    $scope.PatientID = $window.localStorage.getItem("PatientID");
    $scope.WeightData = {
      Weight: "",
      Date: "",
    };
    $scope.toggleView = function () {
      if ($scope.showGraph === 0) {
        $scope.showGraph = 1;
        $scope.showList = 0;
        $scope.tabLabel = "Listado";
        console.log("show graph", $scope.showGraph);
        console.log("show list", $scope.showList);
      } else {
        $scope.showGraph = 0;
        $scope.tabLabel = "Gráfico";
        $scope.showList = 1;
        console.log("show graph", $scope.showGraph);
        console.log("show list", $scope.showList);
      }
    };

    //functions
    //add a new weight
    $scope.createNewWeight = function () {
      console.log("createNewWeight");
      console.log($scope.addWeight);
      console.log($scope.showGraph);
      console.log("other infos");
      console.log($scope.WeightData.Date);
      console.log($scope.WeightData.Weight);

      if ($scope.WeightData.Weight > 0 && $scope.WeightData.Date) {
        alert("registrando peso ");

        var date = new Date($scope.WeightData.Date);
        date.setHours(date.getHours() + 1);

        var newWeightData = {
          PAC_ID: $scope.PatientID,
          PESO: $scope.WeightData.Weight,
          FECHA: date,
        };

        Patient.postWeight(newWeightData).success(function (data) {
          console.log(data);
        });

        $scope.WeightData = {
          Weight: "",
          Date: "",
        };
      } else {
        alert("Para guardar un nuevo usuario debes rellenar todos los campos");
      }
    };
    $scope.showForm = function () {
      $scope.addWeight = 1;
      console.log("add weight", $scope.addWeight);
      console.log("show graph", $scope.showGraph);

      //$scope.showGraph = 0;
    };
    $scope.hideForm = function () {
      $scope.addWeight = 0;
      console.log("add weight", $scope.addWeight);
      console.log("show graph", $scope.showGraph);
      //$scope.showGraph = 1;
    };

    Patient.Weights($scope.PatientID).success(function (data) {
      $scope.weightsList = data;

      $scope.myChartObject = {};
      $scope.myChartObject.type = "ColumnChart";

      $scope.weights = [];

      for (i = 0; i < data.length; i++) {
        $scope.aux = { c: [{ v: data[i].FECHA_ALTER }, { v: data[i].PESO }] };

        $scope.weights.push($scope.aux);
      }

      $scope.myChartObject.data = {
        cols: [
          { id: "t", label: "Día", type: "string" },
          { id: "s", label: "Peso", type: "number" },
        ],
        rows: $scope.weights,
      };

      $scope.myChartObject.options = {
        title: "Histórico de Pesos",
      };
    });
  }
);
