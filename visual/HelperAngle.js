class HelperAngle
{
    constructor(pos, mainAxis, normal, angleValue, color, callback) {
        this.value = angleValue;
        this.color = color;
        this.normal = ((new THREE.Vector3).fromArray(normal)).normalize();
        this.callback = callback;
        this.mainAxis = ((new THREE.Vector3).fromArray(mainAxis)).normalize();
        this.pos = (new THREE.Vector3).fromArray(pos.sub(camera.lastPosition));

        let tempVector_X = new THREE.Vector3(1, 0, 0);
        let quaternionX = (new THREE.Quaternion).setFromUnitVectors(tempVector_X, this.mainAxis);

        let tempVector_Z = new THREE.Vector3(0, 0, 1);
        let quaternionZ = (new THREE.Quaternion).setFromUnitVectors(tempVector_Z, this.normal);

        this.quaternion = quaternionX.multiply(quaternionZ);

        if (this.callback !== undefined) {//do smth
            this.mouseDownListener = this.onMouseDown.bind(this);
            document.addEventListener('mousedown', this.mouseDownListener);
        };


        this.render();
    }

    render() {
        let geometry = new THREE.CircleGeometry(Math.pow(2, 14),
                                                200,
                                                0,
                                                this.value);
        let material = new THREE.MeshBasicMaterial({color: this.color, opacity: 0.175, transparent: true, side: THREE.DoubleSide});
        this.visual = new THREE.Mesh(geometry, material);

        scene.add(this.visual);
        this.visual.position.copy(this.pos);
        this.visual.quaternion.copy(this.quaternion);

        
        this.mainAxisVisual = new THREE.ArrowHelper(this.mainAxis,
                                                    this.pos,
                                                    Math.pow(2, 14),
                                                    this.color);
        scene.add(this.mainAxisVisual);

        if (this.callback !== undefined){
            let tempVector = this.mainAxis.clone();
            this.drct = tempVector.applyAxisAngle(this.normal, this.value);
            this.drctVisual = new THREE.ArrowHelper(this.drct,
                                                    this.pos,
                                                    Math.pow(2, 14),
                                                    0xc2f442);

            scene.add(this.drctVisual);
        }
    }

    update(newPos) {
        this.visual.position.fromArray(newPos.sub(camera.lastPosition));
        this.mainAxisVisual.position.fromArray(newPos.sub(camera.lastPosition));
        if (this.callback !== undefined){
            this.drctVisual.position.fromArray(newPos.sub(camera.lastPosition));
        }
        
        if (this.test !== undefined) { this.test.position.fromArray(newPos.sub(camera.lastPosition)) };
    }

    resize(newValue){
        this.remove();

        this.value = newValue;

        this.render();
    }

     onMouseDown(event) {
        let obj = [this.drctVisual.line, this.drctVisual.cone];
        let intersection = (raycaster.intersectObjects(obj))[0];
        if ((intersection !== undefined)&&(event.button == 0)) { //check if the mouse button pressed is left 
            this.mouseUpListener = this.onMouseUp.bind(this);
            document.addEventListener('mouseup', this.mouseUpListener);
            this.mouseMoveListener = this.onMouseMove.bind(this);
            document.addEventListener('mouseup', this.mouseMoveListener);  
        }
        if (event.button == 2) {
            let val = this.value + Math.PI / 4;
            this.resize(val);
        }
    }

    onMouseUp() { //check if the mouse button pressed is left
        if (event.button == 0) {
            document.removeEventListener('mouseup', this.mouseUpListener);
            document.removeEventListener('mousemove', this.mouseMoveListener);
        }
    } 

    onMouseMove() {
        let obj = [this.drctVisual.line, this.drctVisual.cone];
        let intersection = (raycaster.intersectObjects(obj))[0];
        if (intersection !== undefined) { 
            let drct = (intersection.point).sub(this.visual.position);

            this.test = new THREE.ArrowHelper(drct,
                                              this.pos,
                                              Math.pow(2, 14),
                                              0xc2f442); 
            scene.add(this.test);
                                                         

            let val = Math.acos((this.mainAxis).dot(drct) / (drct.length() * this.mainAxis.length()));
            let tempVector = this.mainAxis.clone();
            tempVector.cross(drct);

            val = (tempVector.dot(this.normal) > 0) ? val : TWO_PI - val;
            this.resize(val);
        }   
    }

    remove() {
        scene.remove(this.visual);
        scene.remove(this.mainAxisVisual);
        if (this.callback !== undefined){
            scene.remove(this.drctVisual);
        };
    }
}