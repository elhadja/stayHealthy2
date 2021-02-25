const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const doctorSchema = mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    tel: { type: String },
    address: { road: String, postalCode: Number, city: String },
    email: { type: String, required: [true, "email field is required"], unique: [true, "a user with this email already exists"]},
    password: { type: String, required: true },
    speciality: { type: String},
    meansOfPayment: { type: [String] },
    diplomas: { type: [String] },
    prices: [{
        description: String,
        price: Number
    }]
});

doctorSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Doctor", doctorSchema);