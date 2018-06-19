import LineObject from "./LineObject";

export default class ArrowObject extends THREE.ArrowHelper
{
    constructor(dir, origin, length, color, headLength, headWidth) {
        super(dir, origin, length, color, headLength, headWidth);
        this.remove(this.line);
        this.line = new LineObject(this.line.geometry, this.line.material);
        this.add(this.line);
    }
}