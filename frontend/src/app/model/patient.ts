import { User } from "./user";

export class Patient extends User{
    constructor(public email: String, public password: String) {
        super(email, password);
    }
}