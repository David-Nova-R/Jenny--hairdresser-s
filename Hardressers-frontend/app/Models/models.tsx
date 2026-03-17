class Disponibility{

    constructor(public availability : boolean, public appointment : BookedAppointment[]){}

}

class BookedAppointment{

    dateStart : Date;
    dateEnd : Date;
    constructor(public service : Service){
        this.dateStart = service.dateStart;
        this.dateEnd = new Date(service.dateStart.getTime() + service.durationInMinutes * 60000);
    }
}

class Service{

    constructor(public name : string, public dateStart : Date, public durationInMinutes : number, public Description : string){}
}