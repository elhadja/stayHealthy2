const Slot = require("../models/slot");

exports.addSlot = (req, res) => {
    const slot = new Slot({...req.body, doctorId: req.userId});
    slot.save()
        .then(savedSlot => {
            res.status(201).json({message: "slot added", slot: savedSlot});
        })
        .catch(error => {
            res.status(400).json(error);
        });
};

exports.updateSlot = (req, res) => {
    Slot.findOneAndUpdate(
        { _id: req.params.id, patientId: {$exists: false }, doctorId: req.userId},
        {...req.body, _id: req.params.id },
        {useFindAndModify: false, new: true}
    )
        .then(mongoRes => {
            if (mongoRes)
                res.status(200).json({message: "slot modified", slot: mongoRes});
            else
                res.status(400).json({error: "slot not found or occupied by à patient"});
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

exports.deleteSlot = (req, res) => {
    Slot.deleteOne({ _id: req.params.id, patientId: {$exists: false }, doctorId: req.userId})
        .then((response) => {
            if (response.deletedCount === 1) 
                res.status(200).json({ message: "slot deleted !", response: response});
            else
                res.status(404).json({ error: "slot not found or occupied by a patient", response: response });
        })
        .catch(error => res.status(404).json({ error: error.message }));

};

exports.getSlotById = (req, res) => {
    Slot.findOne({ _id: req.params.id })
        .then(slot => {
            if (slot) {
                res.status(200).json(slot);
            } else {
                res.status(404).json({error: "slot not found"});
            }
        })
        .catch(error => res.status(500).json(error));

};

// todo to rename
exports.getSlotsBy = (req, res) => {
    Slot.find({ doctorId: req.params.id })
        .then(slots => {
            res.status(200).json(slots);
        })
        .catch(error => res.status(500).json(error));
};


exports.getAppointmentById = (req, res) => {
    Slot.findOne({ _id: req.params.id, patientId: {$exists: true} })
        .then(slot => {
            if (slot)
                res.status(200).json(slot);
            else
                res.status(404).json({error: "appointment not found"});
        })
        .catch(error => res.status(500).json(error));
};

exports.addAppointment = async (req, res) => {
    const patientId = req.params.patientId ? (req.params.patientId) : req.userId;
    Slot.findOneAndUpdate(
        { _id: req.params.slotId, patientId: { $exists: false }},
        { patientId: patientId },
        {useFindAndModify: false, new: true}
    )
        .then(mongoRes => {
            if (mongoRes) {
                res.status(200).json({message: "appointment created", slot: mongoRes});
            }
            else
                res.status(400).json({error: "slot not found or occupied by à patient"});
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

exports.cancelAppointment = (req, res) => {
    Slot.findOneAndUpdate(
        { _id: req.params.id, $or: [{patientId: req.userId}, {doctorId: req.userId}] },
        { $unset: {patientId: ""} },
        {useFindAndModify: false, new: true}
    )
        .then(mongoRes => {
            if (mongoRes)
                res.status(200).json({message: "appointment canceled", slot: mongoRes});
            else
                res.status(400).json({error: "slot not found"});
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

exports.getDoctorAppointments = (req, res) => {
    const userId = req.params.doctorId ? req.params.doctorId : req.userId;
    Slot.find({ doctorId: userId, patientId: {$exists: true} })
        .then(slots => {
            res.status(200).json(slots);
        })
        .catch(error => {
            res.status(501).json(error);
        });
};

exports.getPatientAppointment = (req, res) => {
    const userId = req.params.patientId ? req.params.patientId : req.userId;
    Slot.find({ patientId: userId })
        .then(slots => {
            res.status(200).json(slots);
        })
        .catch(error => {
            res.status(502).json(error);
        });
};