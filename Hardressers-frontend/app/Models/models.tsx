class Disponibility{

    constructor(public availability : boolean, public appointment : BookedAppointment[]){}

}

class BookedAppointment{

    dateStart : Date;
    dateEnd : Date;
    constructor(public HairStyle : HairStyle){
        this.dateStart = HairStyle.dateStart;
        this.dateEnd = new Date(HairStyle.dateStart.getTime() + HairStyle.durationInMinutes * 60000);
    }
}

class HairStyle{

    constructor(public name : string, public dateStart : Date, public durationInMinutes : number, public Description : string){}
}