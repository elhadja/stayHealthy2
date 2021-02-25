const axios = require("axios");

const user = require("./user");

const body = {
    firstName: "Elhadj Amadou",
    lastName: "Bah",
    email: "addAppoitmentBeforAll@gmail.com",
    password: "toto"
};
 

describe("register patient tests: ", () => {
    it("patient should be added", async () => {
        let createPatientResponse;
        let header;
        try {
            createPatientResponse = await user.createPatient({
                ...body,
                email: "addPatientSuccess@gmail.com"
            });
            let logResponse = await user.logPatient({
                email: "addPatientSuccess@gmail.com",
                password: body.password
            });
            header = createHeader(logResponse.data.token);
            expect(createPatientResponse.status).toBe(201);
        } catch (error) {
            fail(error);
        } finally {
            user.deletePatient(createPatientResponse, header);
        }
    });

    it("email should be unique", async () => {
        await user.emailShouldBeUnique("patient");
    });

    it("if required items don't exists, user should not be added", async () => {
        try {
            const body = {
                password: "toto"
            };
            await user.createPatient(body);
            fail();
        } catch(error) {
            expect(error.response.status).toBe(400);
            const numberOfRequiredItems = 1;
            expect(Object.keys(error.response.data.error.errors).length).toBe(numberOfRequiredItems);
        }
    });
});

describe("patient login tests: ", () => {
    const urlBase = "http://localhost:3000";
    it("user should be logged", async () => {
        await user.userShouldBeLogged("patient");
    });

    it("if the password is not correct, the request should fail", async () => {
        await user.incorrectPassword("patient");
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
});

function createHeader(token) {
    const header = { 
        headers: {Authorization: `Bearer ${token}`}
    };
    return header;
}