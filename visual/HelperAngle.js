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
        this.remove();

        let geometry = new THREE.CircleGeometry(Math.pow(2, 14),
                                                200,
                                                0,
                                                this.value);
        let material = new THREE.MeshBasicMaterial({color: this.color, opacity: 0.175, transparent: true, side: THREE.DoubleSide});
        this.angleVisual = new THREE.Mesh(geometry, material);

        scene.add(this.angleVisual);
        this.angleVisual.position.copy(this.pos);
        this.angleVisual.quaternion.copy(this.quaternion);

        
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
        this.pos = (new THREE.Vector3).fromArray(newPos.sub(camera.lastPosition));

        this.angleVisual.position.copy(this.pos);
        this.mainAxisVisual.position.copy(this.pos);
        if (this.callback !== undefined){
            this.drctVisual.position.copy(this.pos);
        }
        
        if (this.test !== undefined) { this.test.position.copy(this.pos) };

        this.createHelperPlane();
    }

    resize(newValue){
        this.value = newValue;

        scene.remove(this.angleVisual);

        let geometry = new THREE.CircleGeometry(Math.pow(2, 14),
                                                200,
                                                0,
                                                this.value);
        let material = new THREE.MeshBasicMaterial({color: this.color, opacity: 0.175, transparent: true, side: THREE.DoubleSide});
        this.angleVisual = new THREE.Mesh(geometry, material);

        scene.add(this.angleVisual);
        this.angleVisual.position.copy(this.pos);
        this.angleVisual.quaternion.copy(this.quaternion);

        if (this.callback !== undefined){
            let tempVector = this.mainAxis.clone();
            this.drct = tempVector.applyAxisAngle(this.normal, this.value);
            this.drctVisual.setDirection(this.drct);
        }
    }

    createHelperPlane() {
        let mrVector = (new THREE.Vector3).crossVectors(this.normal, this.pos);
        let mrCathetus = (new THREE.Vector3).crossVectors(this.normal, mrVector);
        let cos = this.pos.dot(mrCathetus) / (this.pos.length() * mrCathetus.length());
        let angle = (cos >= 0) ? Math.acos(cos) : Math.PI - Math.acos(cos);
        let distance = this.pos.length() * Math.sin(angle);

        this.plane = new HelperPlane(this.normal, - distance);
    }

     onMouseDown(event) {
        let obj = [this.drctVisual.line, this.drctVisual.cone];
        let intersection = (raycaster.intersectObjects(obj))[0];
        if ((intersection !== undefined)&&(event.button == 0)) { //check if the mouse button pressed is left 
            this.mouseUpListener = this.onMouseUp.bind(this);
            document.addEventListener('mouseup', this.mouseUpListener);
            this.mouseMoveListener = this.onMouseMove.bind(this);
            document.addEventListener('mousemove', this.mouseMoveListener);
        }
    }

    onMouseUp() { //check if the mouse button pressed is left
        if (event.button == 0) {
            document.removeEventListener('mouseup', this.mouseUpListener);
            document.removeEventListener('mousemove', this.mouseMoveListener);
        }
    } 

    onMouseMove() {
        let obj = [this.plane];
        let intersection = (raycaster.intersectObjects(obj))[0];
        if (intersection !== undefined) { 
            let drct = (intersection.clone()).sub(this.angleVisual.position).normalize();                       

            let val = Math.acos((this.mainAxis).dot(drct) / (drct.length() * this.mainAxis.length()));
            let tempVector = this.mainAxis.clone();
            tempVector.cross(drct);

            val = (tempVector.dot(this.normal) > 0) ? val : TWO_PI - val;
            this.resize(val);
        }   
    }

    remove() {
        scene.remove(this.angleVisual);
        scene.remove(this.mainAxisVisual);
        if (this.callback !== undefined){
            scene.remove(this.drctVisual);
        };
    }
}