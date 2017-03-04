class HelperAngle
{
    /*constructor(mainAxis, center, point, normal) {
        let pos = point.sub(center);
        let angle = Math.acos(pos.dot(mainAxis) / (pos.mag * mainAxis.mag));
        angle = ((normal.dot(pos.cross(mainAxis))) > 0) ? angle : TWO_PI - angle;

        let geometry = new THREE.CircleGeometry(pos.mag,
                                              200,
                                              0,
                                              angle);
        let material = new THREE.MeshBasicMaterial({color : 0xd442f4, opacity: 0.25, transparent: true});
        this.visual = new THREE.Mesh(geometry, material);
        scene.add(this.visual);
    }*/

    constructor(pos, mainAxis, normal, angleValue, color, resize) {
        if (resize !== undefined) {//do smth
            document.addEventListener('mousedown', onMouseDown);
        };

        this.value = angleValue;
        this.color = color;

        let geometry = new THREE.CircleGeometry(Math.pow(2, 14),
                                              200,
                                              0,
                                              angleValue);
        let material = new THREE.MeshBasicMaterial({color: this.color, opacity: 0.25, transparent: true});
        this.visual = new THREE.Mesh(geometry, material);

        this.render(pos);
    }

    render(pos) {
        scene.add(this.visual);
        this.visual.position.fromArray(pos.sub(camera.lastPosition));
    }

    update(newPos) {
        this.visual.position.fromArray(newPos.sub(camera.lastPosition));
    }

    resize(newValue){
        scene.remove(this.visual);
    }

    /* onMouseDown() {
        //raycast
        if ( raycast ok ) {
            document.addEventListener('mouseup', this.onMouseUp);
            document.addEventListener('mousemove', this.resize);  
        }
    }

    onMouseUp() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.resize);
    } */
}

function onMouseDown() {
      
}

function onMouseUp() {
} 