const Doctor = require("../models/doctor");
const user = require("./user");

exports.addNewUser = (req, res) => {
    user.signup(req, res, Doctor);
};

exports.logsUser = (req, res) => {
    user.signin(req, res, Doctor);
};

exports.deleteUser = (req, res) => {
    user.deleteUser(req, res, Doctor);
};

exports.getDoctorById = (req, res) => {
    user.getUserById(req, res, Doctor);
};

exports.updateDoctor = (req, res) => {
    user.updateUser(req, res, Doctor);
};

exports.getDoctorsBy = (req, res) => {
    let nameFilter = req.query.name ? req.query.name : "";
    let regexNameFilter = new RegExp(["^", nameFilter, "$"].join(""), "i"); 
    let specialityFilter = req.query.speciality ? req.query.speciality : "";
    let postalCodeFilter = req.query.postalCode ? req.query.postalCode : 0;
    
    Doctor.find({ $or: 
        [
            { firstName:  regexNameFilter}, 
            { lastName:  regexNameFilter},
            { speciality: new RegExp(["^", specialityFilter, "$"].join(""), "i")}, 
            { "address.postalCode": postalCodeFilter}
        ]})
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => res.status(500).json(error));
};