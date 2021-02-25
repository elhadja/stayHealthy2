const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const patientSchema = mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    tel: { type: String },
    address: { road: String, postalCode: Number, city: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

patientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Patient", patientSchema);