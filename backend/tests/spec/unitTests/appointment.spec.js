const axios = require("axios");

const user = require("./user");

const appointmentEndPoint = "http://localhost:3000/appointment";
const doctorEndPoint = "http://localhost:3000/doctor";
const patientEndPoint = "http://localhost:3000/patient";
const slotEndPoint = "http://localhost:3000/slot";

const UserBody = {
    firstName: "Elhadj Amadou",
    lastName: "Bah",
    adress: "avenue de collégno",
    email: "addSlotBeforAll@gmail.com",
    password: "toto"
};
const slotBody = {
    date: {
        jj: 25,
        mm: 5,
        yy: 1900
    },
    startHour: {
        hh: 12,
        mn: 45
    },
};

describe("add appointment tests: ", () => {

    let doctorLoginResponse;
    let patientLoginResponse;
    let addDoctorResponse;
    let addPatientResponse;
    let patientHeader = {};
    let doctorHeader = {};
    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "addAppoitmentBeforAll@gmail.com",
                password: "toto"
            };
            addDoctorResponse = await axios.post(doctorEndPoint, body);
            addPatientResponse = await axios.post(patientEndPoint, body);
            doctorLoginResponse = await axios.post(doctorEndPoint + "/login", {
                email: body.email,
                password: body.password
            });
            patientLoginResponse = await axios.post(patientEndPoint + "/login", {
                email: body.email,
                password: body.password
            });
            doctorHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};
            patientHeader.headers = { Authorization: `Bearer ${patientLoginResponse.data.token}`};

        } catch(error) {
            fail(error);
        }
 
    });

    afterAll(async () => {
        await user.deleteDoctor(addDoctorResponse, doctorHeader);
        await user.deletePatient(addPatientResponse, patientHeader);
    });



    it("appointment should created", async () => {
        let postSlotResponse;
        try {
            postSlotResponse = await axios.post(slotEndPoint , slotBody, doctorHeader);
            const createAppointmentResponse = await axios.post(appointmentEndPoint 
                                            + "/" + addPatientResponse.data.id
                                            + "/" + postSlotResponse.data.slot._id, {},
            patientHeader);
            expect(createAppointmentResponse.status).toBe(200);
        } catch (error) {
            fail(error);
        } finally {
            await deleteSlot(postSlotResponse, doctorHeader);
        }
    });

    it("appointment should be created 2", async () => {
        let postSlotResponse;
        try {
            postSlotResponse = await axios.post(slotEndPoint , slotBody, doctorHeader);
            const createAppointmentResponse = await axios.post(appointmentEndPoint 
                                            + "/" + postSlotResponse.data.slot._id, {},
            patientHeader);
            expect(createAppointmentResponse.status).toBe(200);
        } catch (error) {
            fail(error);
        } finally {
            await deleteSlot(postSlotResponse, doctorHeader);
        }
    });

    it("if the appoitment is occupied, the request should fail", async () => {
        let postPatientResponse;
        let postSlotResponse;
        let header;
        try {
            postPatientResponse = await axios.post(patientEndPoint , UserBody);
            const logPatientResponse = await user.logPatient({
                email: UserBody.email,
                password: UserBody.password
            });
            header = createHeader(logPatientResponse.data.token);
            postSlotResponse = await axios.post(slotEndPoint , {
                ...slotBody, 
                patientId: postPatientResponse.data.id
            }, doctorHeader);
            await axios.post(appointmentEndPoint 
                                            + "/" + postPatientResponse.data.id
                                            + "/" + postSlotResponse.data.slot._id, {},
            patientHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.error).toBe("slot not found or occupied by à patient");
        } finally {
            await user.deletePatient(postPatientResponse, header);
            await deleteSlot(postSlotResponse, doctorHeader);
        }
 
    });


    it("if appointment's slot is not valid, then the request should fail", async () => {
        try {
            await axios.post(appointmentEndPoint 
                                            + "/" + addPatientResponse.data.id
                                            + "/" + "eeeeeeeeeeeeeeeeeeeeeeee",
            {},
            patientHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.error).toBe("slot not found or occupied by à patient");
        }         
    });

    it("if the patient not is not authentified, the request should fail", async () => {
        let postSlotResponse;
        let postSlotResponse2;
        try {
            postSlotResponse = await axios.post(slotEndPoint , {
                ...slotBody, 
            }, {}, doctorHeader);
            postSlotResponse2 = await axios.post(appointmentEndPoint 
                                            + "/" + "eeeeeeeeeeeeeeeeeeeeeeee"
                                            + "/" + postSlotResponse.data.slot._id);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(401);
        } finally {
            await deleteSlot(postSlotResponse, doctorHeader);
            await deleteSlot(postSlotResponse2, doctorHeader);
        }
    });
});
describe("cancel appointment tests: ", () => {
    let doctorLoginResponse;
    let patientLoginResponse;
    let addDoctorResponse;
    let addPatientResponse;
    let patientHeader = {};
    let doctorHeader = {};
 
    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "cancelAppointmentBeforAll@gmail.com",
                password: "toto"
            };
            addDoctorResponse = await axios.post(doctorEndPoint, body);
            addPatientResponse = await axios.post(patientEndPoint, body);
            doctorLoginResponse = await axios.post(doctorEndPoint + "/login", {
                email: body.email,
                password: body.password
            });
            patientLoginResponse = await axios.post(patientEndPoint + "/login", {
                email: body.email,
                password: body.password
            });
            doctorHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};
            patientHeader.headers = { Authorization: `Bearer ${patientLoginResponse.data.token}`};

        } catch(error) {
            fail(error);
        }
 
    });

    afterAll(async () => {
        await user.deleteDoctor(addDoctorResponse, doctorHeader);
        await user.deletePatient(addPatientResponse, patientHeader);
    });

    it("appointment should be canceled", async () => {
        let postSlotResponse;
        try {

            postSlotResponse = await axios.post(slotEndPoint , {
                ...slotBody, 
                patientId: addPatientResponse.data.id
            }, doctorHeader);
            const cancelResponse = await axios.put(appointmentEndPoint
                + "/" + postSlotResponse.data.slot._id, {}, patientHeader);
            expect(cancelResponse.status).toBe(200);
            expect(cancelResponse.data.message).toBe("appointment canceled");
        } catch (error) {
            fail(error);
        } finally {
            await deleteSlot(postSlotResponse, doctorHeader);
        }
        
    });

    it("if the slot not exists, the request should fail", async () => {
        try {
            await axios.put(appointmentEndPoint
                + "/" + "eeeeeeeeeeeeeeeeeeeeeeee", {}, patientHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });
});

describe("get appointment by id tests: ", () =>  {
    let doctorLoginResponse;
    let patientLoginResponse;
    let addDoctorResponse;
    let addPatientResponse;
    let patientHeader = {};
    let doctorHeader = {};
 
    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "getAppointmentByIdBeforAll@gmail.com",
                password: "toto"
            };
            addDoctorResponse = await axios.post(doctorEndPoint, body);
            addPatientResponse = await axios.post(patientEndPoint, body);
            doctorLoginResponse = await axios.post(doctorEndPoint + "/login", {
                email: body.email,
                password: body.password
            });
            patientLoginResponse = await axios.post(patientEndPoint + "/login", {
                email: body.email,
                password: body.password
            });
            doctorHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};
            patientHeader.headers = { Authorization: `Bearer ${patientLoginResponse.data.token}`};

        } catch(error) {
            fail(error);
        }
 
    });

    afterAll(async () => {
        await user.deleteDoctor(addDoctorResponse, doctorHeader);
        await user.deletePatient(addPatientResponse, patientHeader);
    });

    it("should get the appointment", async () => {
        let postSlotResponse;
        try {
            postSlotResponse = await axios.post(slotEndPoint , {
                ...slotBody, 
                patientId: addPatientResponse.data.id
            }, doctorHeader);
            const getResponse = await axios.get(appointmentEndPoint 
                + "/" + postSlotResponse.data.slot._id, patientHeader);
            expect(getResponse.status).toBe(200);
            expect(getResponse.data._id).toBe(postSlotResponse.data.slot._id);
        } catch (error) {
            fail(error);
        } finally {
            await deleteSlot(postSlotResponse, doctorHeader);
        }
    });


    it("if the appointment not exists, the request should fail", async () => {
        let postSlotResponse;
        try {
            postSlotResponse = await axios.post(slotEndPoint , {
                ...slotBody, 
            }, doctorHeader);
            await axios.get(appointmentEndPoint 
                + "/" + postSlotResponse.data.slot._id, patientHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(404);
        } finally {
            await deleteSlot(postSlotResponse, doctorHeader);
        }
 
    });
});

describe("get Doctor/Patient appointments tests: ", () => {
    let doctorLoginResponse;
    let patientLoginResponse;
    let addDoctorResponse;
    let addPatientResponse;
    let patientHeader = {};
    let doctorHeader = {};
 
    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "getSeveralAppointmentBeforAll@gmail.com",
                password: "toto"
            };
            addDoctorResponse = await axios.post(doctorEndPoint, body);
            addPatientResponse = await axios.post(patientEndPoint, body);
            doctorLoginResponse = await axios.post(doctorEndPoint + "/login", {
                email: body.email,
                password: body.password
            });
            patientLoginResponse = await axios.post(patientEndPoint + "/login", {
                email: body.email,
                password: body.password
            });
            doctorHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};
            patientHeader.headers = { Authorization: `Bearer ${patientLoginResponse.data.token}`};

        } catch(error) {
            fail(error);
        }
 
    });

    afterAll(async () => {
        await user.deleteDoctor(addDoctorResponse, doctorHeader);
        await user.deletePatient(addPatientResponse, patientHeader);
    });


    it("if the appointments exists, the request should return an array with the appointment", async () => {
        let postSlotResponse1;
        let postSlotResponse2;
        let postSlotResponse3;
        try {
            postSlotResponse1 = await axios.post(slotEndPoint , {
                ...slotBody, 
                patientId: addPatientResponse.data.id
            }, doctorHeader);
            postSlotResponse2 = await axios.post(slotEndPoint , {
                ...slotBody, 
                patientId: addPatientResponse.data.id
            }, doctorHeader);
            postSlotResponse3 = await axios.post(slotEndPoint , {
                ...slotBody, 
            }, doctorHeader);
 
            const getResponse = await axios.get(appointmentEndPoint 
                                                + "/doctor/" + addDoctorResponse.data.id, doctorHeader);

            const getResponse2 = await axios.get(appointmentEndPoint 
                                            + "/patient/" + addPatientResponse.data.id,
            patientHeader);

            const getResponse3 = await axios.get(appointmentEndPoint + "s" 
                                               + "/doctor", doctorHeader);

            const getResponse4 = await axios.get(appointmentEndPoint + "s" 
                                            + "/patient", patientHeader);
            expect(getResponse.status).toBe(200);
            expect(getResponse2.status).toBe(200);
            expect(getResponse3.status).toBe(200);
            expect(getResponse4.status).toBe(200);
            expect(getResponse2.data.length).toBe(2);
        } catch (error) {
            fail(error);
        } finally {
            await deleteSlot(postSlotResponse1, doctorHeader);
            await deleteSlot(postSlotResponse2, doctorHeader);
            await deleteSlot(postSlotResponse3, doctorHeader);
        }
    });
});

async function deleteSlot(axiosResponse, header) {
    try {
        if (axiosResponse)
            await axios.delete(slotEndPoint + "/" + axiosResponse.data.slot._id, header);
    } catch (error) {
        await axios.put(appointmentEndPoint + "/" + axiosResponse.data.slot._id, {}, header);
        await axios.delete(slotEndPoint + "/" + axiosResponse.data.slot._id, header);
    }
}

function createHeader(token) {
    const header = { 
        headers: {Authorization: `Bearer ${token}`}
    };
    return header;
}
