export class Appointment {
    _id: String;
    doctorId: String;
    patientId: String;
    date: {
        jj: number,
        mm: number,
        yy: number
    };
    startHour: {
        hh: number,
        mn: number
    };

    constructor() {

    }
}