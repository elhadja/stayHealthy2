const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const dateSchema = mongoose.Schema({
    jj: { type: Number, required: true},
    mm: { type: Number, required: true},
    yy: { type: Number, required: true},
});

const hourSchema = mongoose.Schema({
    hh: { type: Number, required: true },
    mn: { type: Number, required: true },
});

const slotSchema = mongoose.Schema({
    date: {type: dateSchema, required: true},
    startHour: { type: hourSchema, required: true},
    doctorId: { type: ObjectId, required: true },
    patientId: { type: ObjectId}
});

slotSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Slot", slotSchema);