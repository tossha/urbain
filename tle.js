class tle{
	constructor(tleObject){
		this.name = tleObject.name;
		this.lineOne = tleObject.lineOne;
		this.lineTwo = tleObject.lineTwo;	
	}
	
	getInc(){
		var result = 0;
		var str = ' ';
		for (let i=8; i<16; i++){
			str += this.lineTwo.charAt(i);
		}
		result = parseFloat(str);
		return result
	}
	
	getRaan(){
		var result = 0;
		var str = ' ';
		for (let i=17; i<25; i++){
			str += this.lineTwo.charAt(i);
		}
		result = parseFloat(str);
		return result
	}
	
	getE(){
		var result = 0;
		var str = '0.';
		for (let i=26; i<33; i++){
			str += this.lineTwo.charAt(i);
		}
		result = parseFloat(str);
		return result
	}
	
	getAop(){
		var result = 0;
		var str = ' ';
		for (let i=34; i<42; i++){
			str += this.lineTwo.charAt(i);
		}
		result = parseFloat(str);
		return result
	}
	
	getMeanAnomaly(){
		var result = 0;
		var str = ' ';
		for (let i=43; i<51; i++){
			str += this.lineTwo.charAt(i);
		}
		result = parseFloat(str);
		return result
	}
	
	getMeanMotion(){
		var result = 0;
		var str = ' ';
		for (let i=52; i<63; i++){
			str += this.lineTwo.charAt(i); 
		}
		result = parseFloat(str) / 86400; //day^(-1)/86400 (s/day)=s^(-1)
		return result // s^(-1)
	}
	
	getSma(){
		return Math.cbrt(398600.4415/Math.pow(2*Math.PI*(this.getMeanMotion()),2))
		//sma^3=mu[earth]/(2PI*Frequency)^2
	}
	
	getEpoch(){
		var result = 0;
		var str = ' ';
		var years = parseInt(this.lineOne.charAt(18) + this.lineOne.charAt(19));
		for (let i=20; i<32; i++){
			str += this.lineTwo.charAt(i); 
		}
		var days = parseFloat(str);
		result = years*365.259636*86400 + days*86400;
		return result
	}
}