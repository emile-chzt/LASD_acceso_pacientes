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
      } else {
        $scope.showGraph = 0;
        $scope.tabLabel = "Gráfico";
        $scope.showList = 1;
      }
    };

    //functions
    //delete a weight
    $scope.deleteWeight = function (id) {
      console.log("deleteWeight");
      console.log(id);
      Patient.deleteWeight(id, $scope.PatientID).success(function () {
        // Delete operation completed, now fetch updated weights
        $scope.refreshWeights();
      });
    };

    //create a new weight

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
          // refresh weights list after creating a new weight
          $scope.refreshWeights();
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

    //refresh weights

    $scope.refreshWeights = function () {
      Patient.Weights($scope.PatientID).success(function (data) {
        $scope.weightsList = data;
        $scope.myChartObject = {};

        $scope.weights = [];

        // Calculate max weight to determine color scale
        var maxWeight = 0;
        var averageWeight = 0;
        var minWeight = 0;
        for (var i = 0; i < data.length; i++) {
          var weight = data[i].PESO;
          averageWeight += weight;
          $scope.weights.push({
            c: [{ v: data[i].FECHA_ALTER }, { v: weight }],
          });
          if (weight > maxWeight) {
            maxWeight = weight;
          }
          if (weight < minWeight) {
            minWeight = weight;
          }
        }
        averageWeight = averageWeight / data.length;
        console.log("averageWeight", averageWeight);
        console.log("maxWeight", maxWeight);
        console.log("minWeight", minWeight);

        //now we create the color scale
        var colorScale = ["#FFC0CB", "#98FB98"]; // pastel red, pastel green

        /* $scope.colors = $scope.weights.map(function (weight) {
          var weightValue = weight.c[1].v;
          
          //if weight is less than average weight then it will be green
          //if weight is greater than average weight then it will be red
          var colorIndex = weightValue < averageWeight ? 0 : 1;

          return colorScale[colorIndex];
        });
        */

        var minWeight = Math.min(
          ...$scope.weights.map((weight) => weight.c[1].v)
        );
        var maxWeight = Math.max(
          ...$scope.weights.map((weight) => weight.c[1].v)
        );

        var colorScale = d3
          .scaleLinear()
          .domain([minWeight, maxWeight])
          .range(["#98FB98", "#FF0000"]); // green to red

        $scope.colors = $scope.weights.map(function (weight) {
          var weightValue = weight.c[1].v;
          return colorScale(weightValue);
        });

        console.log("Colors for the chart:", $scope.colors);

        // now we stack the data
        // Initialize an empty data array
        var data2 = [];
        //let's create a new array with only the dates
        var dates = ["Peso", ...data.map((weight) => weight.FECHA_ALTER)];
        console.log("dates", dates);
        data2.push(dates);

        // Loop through dates array to create data points
        for (var i = 0; i < data.length; i++) {
          // Create an array for each data point
          var dataPoint = [data[i].FECHA_ALTER];
          //let's fill the dataPoint with as many 0 as the number of series
          for (var j = 0; j < data.length; j++) {
            dataPoint.push(0);
          }
          // change weight value for the current year
          dataPoint[i + 1] = data[i].PESO;

          // Push the data point to the data array
          data2.push(dataPoint);
        }

        // Log the created data array
        console.log(data2);

        //now the graph will be created with the colorscale

        $scope.myChartObject.type = "ColumnChart";
        $scope.myChartObject.data = data2;
        $scope.myChartObject.options = {
          title: "Historico de Pesos",
          hAxis: {
            title: "Fecha",
          },
          vAxis: {
            minValue: 0,
            title: "Peso (kg)",
          },
          isStacked: true,
          legend: "none",
          colors: $scope.colors, // Add the colors option here
        };
      });
    };

    $scope.refreshWeights();
  }
);
