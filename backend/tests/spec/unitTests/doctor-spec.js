const axios = require("axios");
const { ObjectId } = require("mongodb").ObjectID;

const user = require("./user");
const urlBase = "http://localhost:3000";

describe("doctor login tests: ", () => {
    it("user should be logged", async () => {
        await user.userShouldBeLogged("doctor");
    });

    it("if the user is not registered, the request should fail", async () => {
        try {
            await axios.post(urlBase + "/doctor/login", {
                email: "unknownxyqmldkfjfqlskdfjq@gmail.com",
                password: "toto"
            });
            expect(true).toBe(false);
        } catch(error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toBe("user not found");
        }   
    });

    it("if the password is not correct, the request should fail", async () => {
        await user.incorrectPassword("doctor");
    });
});

describe("register doctor tests: ", () => {
    const urlBase = "http://localhost:3000";

    it("should add a new doctor", async () => {
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "newDoctorSuccess@gmail.com",
                password: "toto"
            };
            const response = await axios.post(urlBase + "/doctor", body);
            const logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            const header = user.createHeader(logResponse.data.token);
            expect(response.status).toBe(201);
            await axios.delete(urlBase + "/doctor/" + response.data.id, header);
        } catch(error) {
            fail(error.response.data);
        }
    });

    it("email should be unique", async () => {
        await user.emailShouldBeUnique("doctor");
    });

    it("if required items don't exists, user should not be added", async () => {
        try {
            const body = {
                password: "toto"
            };
            await axios.post(urlBase + "/doctor", body);
            expect(true).toBe(false);
        } catch(error) {
            expect(error.response.status).toBe(400);
            const numberOfRequiredItems = 3;
            expect(Object.keys(error.response.data.error.errors).length).toBe(numberOfRequiredItems);
        }
    });
});

describe("getting doctor by Id tests: ", () => {
    it("should get a doctor", async () => {
        let postResponse = undefined;
        let header;
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "getDoctorSuccess@gmail.com",
                password: "toto"
            };
            postResponse = await axios.post(urlBase + "/doctor", body);
            const logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            header = user.createHeader(logResponse.data.token);
            const getResponse = await axios.get(urlBase + "/doctor/" + postResponse.data.id, header);
            expect(postResponse.data.id).toBe(getResponse.data._id);
            expect(body.firstName).toBe(getResponse.data.firstName);
            expect(body.lastName).toBe(getResponse.data.lastName);
        } catch(error) {
            fail(error.response);
        } finally {
            if (postResponse)
                await axios.delete(urlBase + "/doctor/" + postResponse.data.id, header);
        }
    });

    it("if the doctor not exists the request should fail", async () => {
        let postResponse;
        let header;
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "getDoctorSuccess@gmail.com",
                password: "toto"
            };
            postResponse = await axios.post(urlBase + "/doctor", body);
            const logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            header = user.createHeader(logResponse.data.token);
 
            const id = new ObjectId("mqkdfjmqldkq");
            await axios.get(urlBase + "/doctor/" + id, header);
            expect(true).toBe(false);
        } catch(error) {
            expect(error.response.status).toBe(404);
        } finally {
            await user.deleteDoctor(postResponse, header);
        }
    });
});

describe("delete doctor tests: ", () => {
    it("if the user exists, the user should be deleted", async () => {
        let postResponse;
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "deleteDoctorSuccess@gmail.com",
                password: "toto"
            };
            postResponse = await axios.post(urlBase + "/doctor", body);
            const logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            const header = user.createHeader(logResponse.data.token);
 
            let deleteResponse = await axios.delete(urlBase + "/doctor/" + postResponse.data.id, header);
            expect(deleteResponse.status).toBe(200);
        } catch(error) {
            fail(error);
        }
    });

    it("only a user should delete his account", async () => {
        let postResponse;
        let header;
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "deleteDoctorSuccess@gmail.com",
                password: "toto"
            };
            postResponse = await axios.post(urlBase + "/doctor", body);
            const logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            header = user.createHeader(logResponse.data.token);
 
            const id = new ObjectId("eeeeeeeeeeeeeeeeeeeeeeee");
            await axios.delete(urlBase + "/doctor/" + id, header);
            expect(true).toBe(false);
        } catch (error) {
            expect(error.response.status).toBe(401);
        } finally {
            await user.deleteDoctor(postResponse, header);
        }
    });
});

describe("update doctor tests: ", () => {
    it("the user should be updated", async () => {
        let postResponse;
        let header;
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "updateDoctorSuccess@gmail.com",
                password: "toto"
            };
            postResponse = await axios.post(urlBase + "/doctor", body);
            const logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            header = user.createHeader(logResponse.data.token);
 
            const updateBody = {
                firstName: "newFirstName",
            };
            const PutResponse = await axios.put(urlBase + "/doctor/" + postResponse.data.id,
                updateBody, header);
            expect(PutResponse.status).toBe(200);
            expect(PutResponse.data.user.firstName).toBe(updateBody.firstName);
        } catch(error) {
            fail(error);
        } finally {
            await user.deleteDoctor(postResponse, header);
        }
    });

    it("only a user can update his data", async () => {
        let postResponse, header;
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "Bah",
                adress: "avenue de collégno",
                email: "deleteDoctorSuccess@gmail.com",
                password: "toto"
            };
            postResponse = await axios.post(urlBase + "/doctor", body);
            const logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            header = user.createHeader(logResponse.data.token);
            const id = new ObjectId("eeeeeeeeeeeeeeeeeeeeeeee");
            await axios.put(urlBase + "/doctor/" + id, {}, header);
            fail();
        } catch (error) {
            expect(error.response.status).toBe(401);
        } finally {
            await user.deleteDoctor(postResponse, header);
        }
    });
});

describe("get severals doctors tests: ", () => {
    it("if no filter is specified, should return an empty array", async () => {
        let header1;
        let postResponse1;
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "testGetByName",
                adress: "avenue de collégno",
                email: "getSeveralDoctorsFaillure@gmail.com",
                password: "toto",
                speciality: "a speciality for test",
                address: {
                    road: "avenue de l'espoire",
                    postalCode: 33400,
                    city: "talence"
                }
            };
            postResponse1 = await axios.post(urlBase + "/doctor", body);
            let logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            header1 = user.createHeader(logResponse.data.token);


            const getResponse = await axios.get(urlBase + "/doctors", header1);
            expect(getResponse.status).toBe(200);
            expect(getResponse.data.length).toBe(0);
        } catch(error) {
            fail(error);
        } finally {
            await user.deleteDoctor(postResponse1, header1);
        }
    });

    it("if doctors exist, request should return an array whitch contents matched doctors", async () => {
        let postResponse1;
        let postResponse2;
        let postResponse3;
        let postResponse4;
        let header1, header2, header3, header4;
        try {
            const body = {
                firstName: "Elhadj Amadou",
                lastName: "testGetByName",
                adress: "avenue de collégno",
                email: "getSeveralDoctorsSuccess@gmail.com",
                password: "toto",
                speciality: "a speciality for test",
                address: {
                    road: "avenue de l'espoire",
                    postalCode: 33400,
                    city: "talence"
                }
            };
            postResponse1 = await axios.post(urlBase + "/doctor", body);
            let logResponse = await user.logDoctor({
                email: body.email,
                password: body.password
            });
            header1 = user.createHeader(logResponse.data.token);

            postResponse2 = await axios.post(urlBase + "/doctor", {
                ...body,
                email: body.email + "1",
                speciality: "aSpeciality"
            });
            logResponse = await user.logDoctor({
                email: body.email + "1",
                password: body.password
            });
            header2 = user.createHeader(logResponse.data.token);

            postResponse3 = await axios.post(urlBase + "/doctor", {
                ...body,
                email: body.email + "2",
                lastName: "aLastName"
            });

            logResponse = await user.logDoctor({
                email: body.email + "2",
                password: body.password
            });
            header3 = user.createHeader(logResponse.data.token);

            postResponse4 = await axios.post(urlBase + "/doctor", {
                ...body,
                email: body.email + "3",
                address: {
                    postalCode: "99990"
                }
            });

            logResponse = await user.logDoctor({
                email: body.email + "3",
                password: body.password
            });
            header4 = user.createHeader(logResponse.data.token);

            const getResponse = await axios.get(urlBase + "/doctors?name=alaStNaMe"
                                                        + "&speciality=aSpecIaliTY"
                                                        + "&postalCode=99990", header4);

            expect(getResponse.status).toBe(200);
            expect(getResponse.data.length).toBe(3);
 
        } catch (error) {
            fail();
        } finally {
            if (postResponse1)
                await axios.delete(urlBase + "/doctor/" + postResponse1.data.id, header1);
            if (postResponse2)
                await axios.delete(urlBase + "/doctor/" + postResponse2.data.id, header2);
            if (postResponse3)
                await axios.delete(urlBase + "/doctor/" + postResponse3.data.id, header3);
            if (postResponse4)
                await axios.delete(urlBase + "/doctor/" + postResponse4.data.id, header4);
 
        }
    });
});