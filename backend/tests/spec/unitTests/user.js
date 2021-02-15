const axios = require("axios");

const urlBase = "http://localhost:3000";
const patientEndPoint = "http://localhost:3000/patient";
const doctorEndPoint = "http://localhost:3000/doctor";

const USER_TYPE = {
    patient: "patient",
    doctor: "doctor"
};

exports.emailShouldBeUnique = async (userType) => {
    let response1;
    let header;
    try {
        const body = {
            firstName: "Elhadj Amadou",
            lastName: "Bah",
            adress: "avenue de collégno",
            email: userType + "EmailShouldBeUnique@gmail.com",
            password: "toto"
        };
        response1 = await axios.post(urlBase + "/" + userType, body);
        const logResponse = await this.logUser(userType, {email: body.email, password: body.password});
        header = await this.createHeader(logResponse.data.token);
        try {
            await axios.post(urlBase + "/" + userType, body);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
            await axios.delete(urlBase + "/" + userType + "/" + response1.data.id, header);
            response1 = undefined;
        }
    } catch(error) {
        fail(error);
    } finally {
        if (userType === USER_TYPE.patient)
            this.deletePatient(response1, header);
        else {
            this.deleteDoctor(response1, header);
        }
    }  
};

exports.incorrectPassword = async (userType) => {
    let addUserResponse = undefined;
    const userBody = {
        firstName: "Elhadj Amadou",
        lastName: "Bah",
        adress: "avenue de collégno",
        email: userType + "incorrectPassword@gmail.com",
        password: "toto"
    };
 
    try {
        addUserResponse = await axios.post(urlBase + "/" + userType, userBody);
        await axios.post(urlBase + "/" + userType + "/login", {
            email: userBody.email,
            password: "qmlkdfmqkdjfmqldjfmqlkdjfmq"
        });
        expect(true).toBe(false);
    } catch(error) {
        expect(error.response.status).toBe(400);
    } finally {
        if (addUserResponse) {
            let logResponse = await this.logUser(userType, {
                email: userBody.email,
                password: userBody.password
            });
            let header = this.createHeader(logResponse.data.token);
            await axios.delete(urlBase + "/" + userType + "/" + addUserResponse.data.id, header);
        }
    }  
};

exports.userShouldBeLogged = async (userType) => {
    try {
        const userBody = {
            firstName: "Elhadj Amadou",
            lastName: "Bah",
            adress: "avenue de collégno",
            email: userType +"ShouldBeLoged@gmail.com",
            password: "toto"
        };
        const addUserResponse = await axios.post(urlBase + "/" + userType, userBody);
        const responseLogin = await axios.post(urlBase + "/" + userType + "/login", {
            email: userBody.email,
            password: "toto"
        });
        const header = this.createHeader(responseLogin.data.token);
        expect(responseLogin.status).toBe(200);
        expect(responseLogin.data.id).toBe(addUserResponse.data.id);
        if (!responseLogin.data.token)
            fail("token should be returned after login");
        await axios.delete(urlBase + "/" + userType + "/" + addUserResponse.data.id, header);
    } catch(error) {
        fail(error.response.data);
    }   
};

exports.deletePatient = async (axiosResponse, header) => {
    if (axiosResponse)
        await axios.delete(patientEndPoint + "/" + axiosResponse.data.id, header);
};


exports.deleteDoctor = async (axiosResponse, header) => {
    if (axiosResponse)
        await axios.delete(doctorEndPoint + "/" + axiosResponse.data.id, header);
};

exports.createPatient = async (body) => {
    const response = await axios.post(patientEndPoint, body);
    return response;
};

exports.createDoctor = async (body) => {
    const response = await axios.post(doctorEndPoint, body);
    return response;
};

exports.logPatient = async (body) => {
    const response = await axios.post(patientEndPoint + "/login", body);
    return response;
};

exports.logDoctor = async (body) => {
    const response = await axios.post(doctorEndPoint + "/login", body);
    return response;
};

exports.logUser = async (userType, body) => {
    let response;
    if (userType === USER_TYPE.doctor)
        response = await this.logDoctor(body);
    else if (userType === USER_TYPE.patient)
        response = await this.logPatient(body);
    else
        throw "invalid user type";
    return response;
};

exports.createHeader = (token) => {
    const header = { 
        headers: {Authorization: `Bearer ${token}`}
    };
    return header;
};



