import { Address } from "./address";

export class User {
    public id: String;
    public firstName: String;
    public lastName: String;
    public address: Address;
    public tel: String;

    constructor(public email: String, public password: String) {
       this.email = email;
       this.password = password;
    }
}