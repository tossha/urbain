const INITIAL_LENGTH = Math.pow(2, 14);
const INITIAL_SEGMENTS_NUMBER = 200;

class HelperAngle
{
    constructor(pos, mainAxis, normal, angleValue, color, callback) {
        this.value = angleValue;
        this.color = color;
        this.normal = (new THREE.Vector3).fromArray(normal).normalize();
        this.callback = callback;
        this.mainAxis = (new THREE.Vector3).fromArray(mainAxis).normalize();
        this.pos = (new THREE.Vector3).fromArray(pos.sub(camera.lastPosition));

        this.isEditMode = false;

        let quaternionX = (new THREE.Quaternion).setFromUnitVectors(
            new THREE.Vector3(1, 0, 0),
            this.mainAxis
        );

        let quaternionZ = (new THREE.Quaternion).setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            this.normal
        );

        this.quaternion = quaternionX.multiply(quaternionZ);

        if (this.callback) {
            this.initEditMode();
        };


        this.render();
    }

    initEditMode() {
        this.isEditMode = true;
        this.mouseDownListener = this.onMouseDown.bind(this);
        document.addEventListener('mousedown', this.mouseDownListener);
    }

    render() {
        this.remove();

        let geometry = new THREE.CircleGeometry(
            INITIAL_LENGTH,
            INITIAL_SEGMENTS_NUMBER,
            0,
            this.value
        );
        let material = new THREE.MeshBasicMaterial({color: this.color, opacity: 0.175, transparent: true, side: THREE.DoubleSide});
        this.threeAngle = new THREE.Mesh(geometry, material);

        scene.add(this.threeAngle);
        this.threeAngle.position.copy(this.pos);
        this.threeAngle.quaternion.copy(this.quaternion);

        
        this.threeMainAxis = new THREE.ArrowHelper(
            this.mainAxis,
            this.pos,
            INITIAL_LENGTH,
            this.color
        );

        scene.add(this.threeMainAxis);

        if (this.isEditMode) {
            this.direction = this.mainAxis
                .clone()
                .applyAxisAngle(this.normal, this.value);

            this.threeDirection = new THREE.ArrowHelper(
                this.direction,
                this.pos,
                INITIAL_LENGTH,
                this.isEditMode ? 0xc2f442 : this.color
            );

            scene.add(this.threeDirection);
        }
    }

    update(newPos) {
        this.pos = (new THREE.Vector3).fromArray(newPos.sub(camera.lastPosition));

        this.threeAngle.position.copy(this.pos);
        this.threeMainAxis.position.copy(this.pos);
        this.threeDirection.position.copy(this.pos);

        this.createHelperPlane();
    }

    resize(newValue) {
        this.value = newValue;

        scene.remove(this.threeAngle);

        this.threeAngle.geometry.dispose();
        this.threeAngle.geometry = new THREE.CircleGeometry(
            INITIAL_LENGTH,
            INITIAL_SEGMENTS_NUMBER,
            0,
            this.value
        );

        scene.add(this.threeAngle);
        this.threeAngle.position.copy(this.pos);
        this.threeAngle.quaternion.copy(this.quaternion);

        if (this.isEditMode) {
            this.direction = this.mainAxis
                .clone()
                .applyAxisAngle(this.normal, this.value);
            this.threeDirection.setDirection(this.direction);

            //this.callback(newValue);
            //is not a function yet
        }
    }

    createHelperPlane() {
        let mrVector = (new THREE.Vector3).crossVectors(this.normal, this.pos);
        let mrCathetus = (new THREE.Vector3).crossVectors(this.normal, mrVector);
        let cos = this.pos.dot(mrCathetus) / (this.pos.length() * mrCathetus.length());
        let angle = (cos >= 0) ? Math.acos(cos) : Math.PI - Math.acos(cos);
        let distance = this.pos.length() * Math.sin(angle);

        this.plane = new VirtualPlane(this.normal, - distance);
    }

     onMouseDown(event) {
        let obj = [this.threeDirection.line, this.threeDirection.cone];
        let intersection = (raycaster.intersectObjects(obj))[0];
        if ((intersection !== undefined) && (event.button == 0)) { //check if the mouse button pressed is left
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
            const direction = intersection.point
                .clone()
                .sub(this.threeAngle.position)
                .normalize();

            let val = Math.acos((this.mainAxis).dot(direction)); // no division by lengths because direction and mainAxis are normalized (length = 1)
            let tempVector = this.mainAxis.clone();
            tempVector.cross(direction);

            val = (tempVector.dot(this.normal) > 0) ? val : TWO_PI - val;
            this.resize(val);
        }   
    }

    remove() {
        scene.remove(this.threeAngle);
        scene.remove(this.threeMainAxis);
        scene.remove(this.threeDirection);
    }
}