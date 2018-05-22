export default class PhysicalBodyModel
{
    constructor(config) {
        this.mu       = config.mu;     // gravitational parameter
        this.radius   = config.radius;
        this.eqRadius = config.eqRadius;
        this.j2       = config.j2 || 0;
    }
}