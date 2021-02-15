const axios = require("axios");

const user = require("./user");

const urlBase = "http://localhost:3000";


describe("add slot tests: ", () => {

    let beforeAllPost;
    let doctorLoginResponse;
    let addSlotHeader = {};

    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "addSlotBeforAll@gmail.com",
                password: "toto"
            };
            beforeAllPost = await axios.post(urlBase + "/doctor", body);
            doctorLoginResponse = await axios.post(urlBase + "/doctor/login", {
                email: body.email,
                password: body.password
            });
            addSlotHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};
        } catch(error) {
            fail("error in before All: ", error);
        }
 
    });

    afterAll(async () => {
        const header = createHeader(doctorLoginResponse.data.token);
        await user.deleteDoctor(beforeAllPost, header);
    });

    it("slot should be added", async () => {
        const body = {
            date: {
                jj: 25,
                mm: 5,
                yy: 1900
            },
            startHour: {
                hh: 12,
                mn: 45
            },
            doctorId: beforeAllPost.data.id
        };
        let postResponse;
        try {
            postResponse = await addSlot(body, addSlotHeader);
            expect(postResponse.status).toBe(201);
            expect(postResponse.data.message).toBe("slot added");
        } catch (error) {
            fail(error);
        } finally {
            await deleteSlot(postResponse, addSlotHeader);
        }
    });

    it("if required elements not exists, then request should fail", async () => {
        let postResponse;
        try {
            postResponse = await addSlot({}, addSlotHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
        } finally {
            await deleteSlot(postResponse, addSlotHeader);
        }
        
    });

    it("if date items not exists, then request should fail", async () => {
        let postResponse;
        try {
            const body = {
                date: {
                },
                startHour: {
                    hh: 12,
                    mn: 51
                },
                doctorId: beforeAllPost.data.id
            };
            postResponse = await addSlot(body, addSlotHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
            const requiredItemNumber = 4;
            expect(Object.keys(error.response.data.errors).length).toBe(requiredItemNumber);
        } finally {
            await deleteSlot(postResponse, addSlotHeader);
        }
        
    });

    it("if hour items not exists, then request should fail", async () => {
        let postResponse;
        try {
            const body = {
                date: {
                    jj: 25,
                    mm: 5,
                    yy: 1900
                },
                startHour: {
                },
                doctorId: beforeAllPost.data.id
            };
            postResponse = await addSlot(body, addSlotHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
            const requiredItemNumber = 3;
            expect(Object.keys(error.response.data.errors).length).toBe(requiredItemNumber);
        } finally {
            await deleteSlot(postResponse, addSlotHeader);
        }
 
    });

    it("if the doctor is not identified, the request should fail", async () => {
        let postResponse;
        try {
            const body = {
                date: {
                    jj: 25,
                    mm: 5,
                    yy: 1900
                },
                startHour: {
                    hh: 12,
                    mn: 5
                },
            };
 
            postResponse = await axios.post(urlBase + "/slot", body, {
                headers: { Authorization: `Bearer ${doctorLoginResponse.data.token + "x"}`}
            });
            fail();
        } catch (error) {
            expect(error.response.status).toBe(401);
        } finally {
            await deleteSlot(postResponse, addSlotHeader);
        }
    });
});

describe(("update slot tests: "), () => {
    const urlBase = "http://localhost:3000";

    let beforeAllPost;
    let doctorLoginResponse;
    let updateSlotHeader = {};
    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "updateSlotBeforAll@gmail.com",
                password: "toto"
            };
            beforeAllPost = await axios.post(urlBase + "/doctor", body);
            doctorLoginResponse = await axios.post(urlBase + "/doctor/login", {
                email: body.email,
                password: body.password
            });
            updateSlotHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};
 
        } catch(error) {
            fail(error);
        }
    });

    afterAll(async () => {
        const header = createHeader(doctorLoginResponse.data.token);
        user.deleteDoctor(beforeAllPost, header);
    });

    it("slot should be updated", async () => {
        let postResponse;
        try {
            const body = {
                date: {
                    jj: 25,
                    mm: 5,
                    yy: 1900
                },
                startHour: {
                    hh: 12,
                    mn: 5
                },
                doctorId: beforeAllPost.data.id
            };
 
            postResponse = await axios.post(urlBase + "/slot", body, updateSlotHeader);
            const putResponse = await axios.put(urlBase + "/slot/" + postResponse.data.slot._id, {
                ...body,
                startHour: {
                    hh: 13,
                    mn: 3
                }               
            }, updateSlotHeader);
            expect(putResponse.status).toBe(200);
            expect(putResponse.data.slot.startHour.hh).toBe(13);
            expect(putResponse.data.slot.startHour.mn).toBe(3);
        } catch (error) {
            fail(error);
        } finally {
            await deleteSlot(postResponse, updateSlotHeader);
        }
    });

    it("if the slot not exists, request should fail", async () => {
        try {
            await axios.put(urlBase + "/slot/eeeeeeeeeeeeeeeeeeeeeeee", {}, updateSlotHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
        }  
    });

    it("if the slot is taken, request should fail", async () => {
        let postResponse;
        try {
            const body = {
                date: {
                    jj: 25,
                    mm: 5,
                    yy: 1900
                },
                startHour: {
                    hh: 12,
                    mn: 5
                },
                patientId: "aaaaaaaaaaaaaaaaaaaaeeee"
            };
 
            postResponse = await axios.post(urlBase + "/slot", body, updateSlotHeader);
            await axios.put(urlBase + "/slot/" + postResponse.data.slot._id, {
                ...body,
                startHour: {
                    hh: 13,
                    mn: 3
                }               
            }, updateSlotHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(400);
        } finally {
            await deleteSlot(postResponse, updateSlotHeader);
        }
    });
});

describe("delete slot tests: ", () => {
    const urlBase = "http://localhost:3000";

    let beforeAllPost;
    let doctorLoginResponse;
    let delteSlotHeader = {};
    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "deleteSlotBeforAll@gmail.com",
                password: "toto"
            };
            beforeAllPost = await axios.post(urlBase + "/doctor", body);
            doctorLoginResponse = await axios.post(urlBase + "/doctor/login", {
                email: body.email,
                password: body.password
            });
            delteSlotHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};

        } catch(error) {
            fail(error);
        }
 
    });

    afterAll(async () => {
        const header = createHeader(doctorLoginResponse.data.token);
        await user.deleteDoctor(beforeAllPost, header);
    });


    it("slot should be deleted", async () => {
        let postResponse;
        try {
            const body = {
                date: {
                    jj: 25,
                    mm: 5,
                    yy: 1900
                },
                startHour: {
                    hh: 12,
                    mn: 5
                },
                doctorId: beforeAllPost.data.id,
            };
            postResponse = await addSlot(body, delteSlotHeader);
            const deleteResponse = await axios.delete(urlBase + "/slot/" + postResponse.data.slot._id, delteSlotHeader);
            expect(deleteResponse.status).toBe(200);
            postResponse = undefined;
        } catch (error) {
            fail();
        } finally {
            await deleteSlot(postResponse);
        }
        
    });
    it("if the slot not exists, the request should fail", async () => {
        try {
            await axios.delete(urlBase + "/slot/" + "eeeeeeeeeeeeeeeeeeeeaeae", delteSlotHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.error).toBe("slot not found or occupied by a patient");
        } 
    });

    it("if the sltot is occupied by a patient the request should fail", async () => {
        let postResponse;
        try {
            const body = {
                date: {
                    jj: 25,
                    mm: 5,
                    yy: 1900
                },
                startHour: {
                    hh: 12,
                    mn: 5
                },
                doctorId: beforeAllPost.data.id,
                patientId: "eeeeeeeeeeeeeeeeeeeeeeee"
            };
            postResponse = await addSlot(body, delteSlotHeader);
            await axios.delete(urlBase + "/slot/" + postResponse.data.slot._id, delteSlotHeader);
            postResponse = undefined;
            fail();
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.error).toBe("slot not found or occupied by a patient");
        } finally {
            await deleteSlot(postResponse, delteSlotHeader);
        }
    });
});

describe("get slot tests: ", () => {
    let beforeAllPost;
    let doctorLoginResponse;
    let getSlotHeader = {};
    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "getSlotBeforAll@gmail.com",
                password: "toto"
            };
            beforeAllPost = await axios.post(urlBase + "/doctor", body);
            doctorLoginResponse = await axios.post(urlBase + "/doctor/login", {
                email: body.email,
                password: body.password
            });
            getSlotHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};

        } catch(error) {
            fail(error);
        }
 
    });

    afterAll(async () => {
        const header = createHeader(doctorLoginResponse.data.token);
        await user.deleteDoctor(beforeAllPost, header);
    });


    const urlBase = "http://localhost:3000";
    it("if the slot exists, the request should success", async () => {
        let postSlotResponse;
        try {
            const body = {
                date: {
                    jj: 25,
                    mm: 5,
                    yy: 1900
                },
                startHour: {
                    hh: 12,
                    mn: 5
                },
            };
            postSlotResponse = await addSlot(body, getSlotHeader);
            const getResponse = await axios.get(urlBase + "/slot/" + postSlotResponse.data.slot._id, getSlotHeader);
            expect(getResponse.status).toBe(200);
            expect(getResponse.data._id).toBe(postSlotResponse.data.slot._id);
        } catch (error) {
            fail(error);
        } finally {
            await deleteSlot(postSlotResponse, getSlotHeader);
        }
    });

    it("if the slot not exists, the request should fail", async () => {
        try {
            await axios.get(urlBase + "/slot/" + "eeeeeeeeeeeeeeeeeeeeaeae", getSlotHeader);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.error).toBe("slot not found");
        } 
 
    });
});

describe("get several slots tests: ", () => {
    const urlBase = "http://localhost:3000";

    let beforeAllPost;
    let beforeAllHeader;
    let getSeveralSlotHeader = {};
    beforeAll(async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "getSeveralSlotBeforAll@gmail.com",
                password: "toto"
            };
            beforeAllPost = await axios.post(urlBase + "/doctor", body);
            const doctorLoginResponse = await axios.post(urlBase + "/doctor/login", {
                email: body.email,
                password: body.password
            });
            beforeAllHeader = createHeader(doctorLoginResponse.data.token);
            getSeveralSlotHeader.headers = { Authorization: `Bearer ${doctorLoginResponse.data.token}`};

        } catch(error) {
            fail(error);
        }
 
    });

    afterAll(async () => {
        await user.deleteDoctor(beforeAllPost, beforeAllHeader);
    });

    it("if the slots exists, the request should return an array whitch contents found slots", async () => {
        let postSlotResponse1, postSlotResponse2;
        try {
            const body = {
                date: {
                    jj: 25,
                    mm: 5,
                    yy: 1900
                },
                startHour: {
                    hh: 12,
                    mn: 5
                },
            };
            postSlotResponse1 = await axios.post(urlBase + "/slot", body, getSeveralSlotHeader);
            postSlotResponse2 = await axios.post(urlBase + "/slot", body, getSeveralSlotHeader);
            const getResponse = await axios.get(urlBase + "/slots/" + beforeAllPost.data.id, getSeveralSlotHeader);
            expect(getResponse.status).toBe(200);
            expect(getResponse.data.length).toBe(2);
        } catch(error) {
            fail(error);
        } finally {
            await deleteSlot(postSlotResponse1, getSeveralSlotHeader);
            await deleteSlot(postSlotResponse2, getSeveralSlotHeader);
        }
  
    });

    it("if the doctor not exists, the request should send an empty array", async () => {
        try {
            const doctorId = "eeeeeeeeeeeeeeeeeeeeaeae";
            const getResponse = await axios.get(urlBase + "/slots/" + doctorId, getSeveralSlotHeader);
            expect(getResponse.status).toBe(200);
            expect(getResponse.data.length).toBe(0);
        } catch (error) {
            fail(error);
        } 
        
    });
});

async function deleteSlot(axiosResponse, header) {
    try {
        if (axiosResponse)
            await axios.delete(urlBase + "/slot/" + axiosResponse.data.slot._id, header);
    } catch (error) {
        await axios.put(urlBase + "/appointment" + "/" + axiosResponse.data.slot._id, {}, header);
        await axios.delete(urlBase + "/slot/" + axiosResponse.data.slot._id, header);
    }
}

async function addSlot(requestBody, requestHeader) {
    const postResponse = await axios.post(urlBase + "/slot", requestBody, requestHeader);
    return postResponse;
}

function createHeader(token) {
    const header = { 
        headers: {Authorization: `Bearer ${token}`}
    };
    return header;
}
