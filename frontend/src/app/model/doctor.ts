import { User } from "./user";

export class Doctor extends User {
    public speciality: String;
    public meansOfPayment: Array<String>;
    public diplomas: Array<String>;
    public prices: Array<String>;

    constructor(public email: String, public password: String) {
        super(email, password);
    }
}