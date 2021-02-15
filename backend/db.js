const mongoose = require("mongoose");

const dbName = "stayHealthy";
const uri = "mongodb+srv://elhadjium:270795mongo@cluster0.u6wuq.mongodb.net/" + dbName + "?retryWrites=true&w=majority";

exports.init = () => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("mongodb reached !"))
        .catch((error) => console.log("error when attempting to connect to mongodb: ", error));

};