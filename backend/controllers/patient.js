const Patient = require("../models/patient");
const user = require("./user");

exports.addNewUser = (req, res) => {
    user.signup(req, res, Patient);
};

exports.logsUser = (req, res) => {
    user.signin(req, res, Patient);
};

exports.deleteUser = (req, res) => {
    user.deleteUser(req, res, Patient);
};

//To Test
exports.getPatientById = (req, res) => {
    user.getUserById(req, res, Patient);
};

exports.updatePatient = (req, res) => {
    user.updateUser(req, res, Patient);
};