var bodyParser = require("body-parser"); // get body-parser
var jwt = require("jsonwebtoken"); // para trabajar el token
var fs = require("fs");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

module.exports = function (app, express) {
  var apiRouter = express.Router();

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  apiRouter.post("/authenticate", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    req.getConnection(function (err, conn) {
      if (err) return next("Cannot Connect");

      var query = conn.query(
        "SELECT USER, PASSWORD, PAC_ID FROM tbpacientes WHERE USER = ? ",
        [username],
        function (err, data) {
          if (err) {
            console.log(err);
            return next("Mysql error, check your query");
          }

          // no user with that username was found
          if (data.length == 0) {
            res.json({
              success: false,
              message: "Authentication failed. User not found.",
            });
          } else if (data.length > 0) {
            if (password == data[0].PASSWORD) {
              res.json({
                success: true,
                patientId: data[0].PAC_ID,
              });
            } else {
              res.json({
                success: false,
                message: "Authentication failed. Wrong password.",
              });
            }
          }
        }
      );
    });
  });

  // Pesos del paciente
  // ----------------------------------------------------

  apiRouter
    .route("/weights/:patientId")

    // GET Patients
    .get(function (req, res) {
      var patientId = req.params.patientId;
      req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        //Obtener datos de pacientes
        var query = conn.query(
          'SELECT DATE_FORMAT(FECHA, "%d-%m-%Y") FECHA_ALTER, FECHA,PESO,PESO_ID FROM tbpeso WHERE PAC_ID=? ORDER BY FECHA ASC',
          patientId,
          function (err, weights) {
            if (err) {
              console.log(err);
              return next("Mysql error, check your query");
            }
            res.json(weights);
          }
        );
      });
    })
    .post(function (req, res) {
      req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        var query = conn.query(
          "INSERT INTO tbpeso SET ? ON DUPLICATE KEY UPDATE ?",
          [req.body, req.body],
          function (err, newWeight) {
            if (err) {
              console.log(err);
              return next("Mysql error, check your query");
            }
            res.json(newWeight);
          }
        );
      });
    });
  //deleting a weight
  apiRouter
    .route("/deleteWeights/:weightId/:patientId")
    .delete(function (req, res) {
      var weightId = req.params.weightId;
      var patientId = req.params.patientId;
      console.log(
        "deleteWeights of id: " + weightId + " from patient: " + patientId
      );
      req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");

        var query = conn.query(
          "DELETE FROM tbpeso WHERE PESO_ID = ? AND PAC_ID = ?",
          [weightId, patientId],
          function (err, weight) {
            if (err) {
              console.log(err);
              return next("Mysql error, check your query");
            }
            res.json(weight);
          }
        );
      });
    });
  //get the doctors
  apiRouter.route("/doctors").get(function (req, res) {
    req.getConnection(function (err, conn) {
      if (err) return next("Cannot Connect");

      var query = conn.query(
        "SELECT * FROM tbmedicos",
        function (err, doctors) {
          if (err) {
            console.log(err);
            return next("Mysql error, check your query");
          }
          res.json(doctors);
        }
      );
    });
  });
  //get the visits for this patient
  apiRouter.route("/visits/:patientId").get(function (req, res) {
    var patientId = req.params.patientId;
    req.getConnection(function (err, conn) {
      if (err) return next("Cannot Connect");

      var query = conn.query(
        "SELECT * FROM tbvisitas WHERE PAC_ID = ?",
        patientId,
        function (err, visits) {
          if (err) {
            console.log(err);
            return next("Mysql error, check your query");
          }
          res.json(visits);
        }
      );
    });
  });
  return apiRouter;
};
