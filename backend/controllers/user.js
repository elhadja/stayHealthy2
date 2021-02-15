const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const Slot = require("../models/slot");

exports.deleteUser = (req, res, UserModel) => {
    UserModel.deleteOne({ _id: req.params.id })
        .then(async (response) => {
            if (response.deletedCount === 1) {
                if (UserModel.collection.collectionName === "patients")
                    await cancelPatientAppoitment(req.params.id);
                else
                    await deleteDoctorSlots(req.params.id);
                res.status(200).json({ message: "user deleted !", response: response});
            }
            else
                res.status(404).json({ error: "user not found", response: response });
        })
        .catch(error => res.status(404).json({ error: error.message }));
};

async function deleteDoctorSlots(doctorId) {
    await Slot.deleteMany({
        doctorId: doctorId
    });
}

async function cancelPatientAppoitment(patientId) {
    await Slot.updateMany(
        { patientId: patientId },
        { $unset: {patientId: ""} }
    );
}

exports.signin = (req, res, UserModel) => {
    UserModel.findOne({email: req.body.email})
        .then(user=> {
            if (!user)
                res.status(400).json({ message: "user not found" });
            else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid)
                            res.status(400).json({ message: "incorrect password" });
                        else {
                            res.status(200).json({
                                id: user._id,
                                token: jwt.sign(
                                    { userId: user._id, scope: UserModel.collection.collectionName},
                                    "RANDOM_TOKEN_SECRET",
                                    { expiresIn: "24h" }
                                )
                            });
                        }
                    })
                    .catch(err => {
                        res.json(err);
                    });
            }
        })
        .catch(err => res.json({err}));
};

exports.signup = async (req, res, UserModel) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = new UserModel({...req.body});
        user.save()
            .then((savedUser) => res.status(201).json({
                message: "user created", id: savedUser._id
            }))
            .catch(error => {
                res.status(400).json({error: error});
            });
    } catch (error) {
        res.status(400).json({error: "password field is required"});
    }
};

exports.getUserById = (req, res, UserModel) => {
    UserModel.findOne({ _id: new ObjectId(req.params.id) })
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({error: "user not found"});
            }
        })
        .catch(error => res.status(500).json(error));
};

exports.updateUser = async (req, res, UserModel) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {...req.body, _id: req.params.id}, 
        {useFindAndModify: false, new: true})
        .then((mongoRes) => {
            if(mongoRes)
                res.status(200).json({message: "user modified", user: mongoRes});
            else
                res.status(404).json({error: "user not found"});
        })
        .catch(error => {
            if (error.codeName === "DuplicateKey") {
                res.status(400).json({error: "duplicate key", keys: error.keyValue});
            }
            res.status(500).json(error);
        });
};