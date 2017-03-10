class HelperAngle
{
    constructor(pos, mainAxis, normal, angleValue, color, callback) {
        this.value = angleValue;
        this.color = color;
        this.normal = ((new THREE.Vector3).fromArray(normal)).normalize();
        this.callback = callback;

        let geometry = new THREE.CircleGeometry(Math.pow(2, 14),
                                              200,
                                              0,
                                              this.value);
        let material = new THREE.MeshBasicMaterial({color: this.color, opacity: 0.175, transparent: true, side: THREE.DoubleSide});
        this.visual = new THREE.Mesh(geometry, material);

        this.mainAxis = (new THREE.Vector3).fromArray(mainAxis);
        this.pos = (new THREE.Vector3).fromArray(pos.sub(camera.lastPosition));

        this.mainAxisVisual = new THREE.ArrowHelper(this.mainAxis,
                                                    this.pos,
                                                    Math.pow(2, 14),
                                                    this.color);

        if (this.callback !== 'undefined') {//do smth
            //document.addEventListener('mousedown', this.onMouseDown);
            //this.callback = сallback;

            this.drct = this.mainAxis.applyAxisAngle(this.normal, this.value);
            this.drctVisual = new THREE.ArrowHelper(this.drct,
                                                    this.pos,
                                                    Math.pow(2, 14),
                                                    0xc2f442);
        };


        this.render(pos);
    }

    render(pos) {
        scene.add(this.visual);
        this.visual.position.fromArray(pos.sub(camera.lastPosition));
        
        scene.add(this.mainAxisVisual);
        if (this.drctVisual !== undefined){
            scene.add(this.drctVisual);
        }
    }

    update(newPos) {
        this.visual.position.fromArray(newPos.sub(camera.lastPosition));
        this.mainAxisVisual.position.fromArray(newPos.sub(camera.lastPosition));
        if (this.drctVisual !== undefined){
            this.drctVisual.position.fromArray(newPos.sub(camera.lastPosition));
        }
    }

    resize(newValue){
        scene.remove(this.visual);
    }

     onMouseDown() {
        /*raycast
        if ( raycast ok ) {
            document.addEventListener('mouseup', this.onMouseUp);
            document.addEventListener('mousemove', this.onMouseMove);   
        }*/
    }

    onMouseUp() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    } 

    onMouseMove() {
        //raycast

    }

    remove() {
        scene.remove(this.visual);
    }
}