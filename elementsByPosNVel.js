function getElementsByPositionAndVelocity(pos,vel,mu) //mu = mu of parent body
{
    var angMomentum = { x: pos.y * vel.z + pos.z * vel.y,
        y: pos.x * vel.z + pos.x * vel.y,
    	z: pos.y * vel.x + pos.x * vel.y
    };
    var angMomentumMod = Math.sqrt(Math.pow(angMomentum.x, 2) + Math.pow(angMomentum.y, 2) + Math.pow(angMomentum.z, 2));
    var raan = Math.atan(- (angMomentum.x / angMomentum.y)); //raan
    var inc = Math.atan((Math.sqrt(Math.pow(angMomentum.x, 2) + Math.pow(angMomentum.y, 2))) / angMomentum.z); //inclination
    var sma = (mu * pos.mag) / (2 * mu - pos.mag * Math.pow(vel.mag, 2)); //semimajor axis
    var e = Math.sqrt(1 - Math.pow(vel.mag, 2) / (mu * sma)); //eccentricity
    
    var p = pos.rotateX(inc).rotateZ(raan);
    var u = Math.atan(p.y / p.x);
    var radVel = (vel.x * pos.x + vel.y * pos.x + vel.z * pos.z) / pos.mag;
    var cosE = (sma - pos.mag) / (sma * e);
    var sinE = (pos.mag * radVel) / (e * Math.sqrt(mu * sma));
    var E = Math.acos (cosE);
    var nu = Math.atan(Math.sqrt(1 - e * e) * sinE) / (cosE - e);
    
    var aop = u - nu; //argument of periapsis
	var m0 = E - e * sinE; //mean anomaly
    
    return {
        _sma: sma,
		_e: e,
		_inc: inc,
		_raan: raan,
		_aop: aop,
		_m0: m0
    }
}