class TLE{
    constructor(tleObject){
	    this.name = tleObject.name;
	    this.lineOne = tleObject.lineOne;
	    this.lineTwo = tleObject.lineTwo;	
    }

    getInc(){
	    return parseFloat(this.lineTwo.substr(8, 8));
    }

    getRaan(){
	    return parseFloat(this.lineTwo.substr(17, 8));
    }

    getE(){
	    return parseFloat('0.' + this.lineTwo.substr(26, 8));
    }

    getAop(){
	    return parseFloat(this.lineTwo.substr(34, 8));
    }

    getMeanAnomaly(){
	    return parseFloat(this.lineTwo.substr(43, 8));
    }

    getMeanMotion(){
	    return parseFloat(this.lineTwo.substr(52, 11)) / 86400; //day^(-1)/86400 (s/day)=s^(-1)
    }

    getSma(){
	    return Math.cbrt(BODIES[EARTH].physicalModel.mu / Math.pow(2 * Math.PI * (this.getMeanMotion()), 2))
	    //sma^3=mu[earth]/(2PI*Frequency)^2
    }

    getEpoch(){
	    var result = 0;
	    var years = parseInt(this.lineOne.substr(18, 2));
	    var days = parseFloat(this.lineTwo.substr(20, 12));
	    result = years * 365.259636 * 86400 + days * 86400;
	    return result
    }
}