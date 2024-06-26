angular
  .module("patientService", [])

  .factory("Patient", function ($http) {
    // create a new object
    var patientFactory = {};

    // log a user in
    patientFactory.login = function (username, password) {
      return $http.post("/api/authenticate", {
        username: username,
        password: password,
      });
    };

    // get associated weights
    patientFactory.Weights = function (id) {
      console.log("getting weights via patientFactory.Weights");
      return $http.get("/api/weights/" + id);
    };

    // post a new weight
    patientFactory.postWeight = function (data) {
      console.log("posting via patientFactory.postWeight");
      console.log(data);
      id = data.PAC_ID;

      return $http.post("/api/weights/" + id, data);
    };
    // delete a weight
    patientFactory.deleteWeight = function (weightID, patientID) {
      console.log("deleting via patientFactory.deleteWeight");
      return $http.delete("/api/deleteWeights/" + weightID + "/" + patientID);
    };
    //get all doctors
    patientFactory.getDoctors = function () {
      console.log("getting doctors via patientFactory.getDoctors");
      return $http.get("/api/doctors");
    };
    // get visits by ID
    patientFactory.getVisitsByID = function (id) {
      console.log("getting visits via patientFactory.getVisitsByID");
      return $http.get("/api/visits/" + id);
    };
    // return our entire userFactory object
    return patientFactory;
  });
