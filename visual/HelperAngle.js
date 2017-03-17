class HelperAngle
{
    constructor(pos, mainAxis, normal, angleValue, color, callback) {
        let that = this;

        this.value = angleValue;
        this.color = color;
        this.normal = ((new THREE.Vector3).fromArray(normal)).normalize();
        this.callback = callback;
        this.mainAxis = (new THREE.Vector3).fromArray(mainAxis);
        this.pos = (new THREE.Vector3).fromArray(pos.sub(camera.lastPosition));

        

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
        
        this.mainAxisVisual = new THREE.ArrowHelper(this.mainAxis,
                                                    this.pos,
                                                    Math.pow(2, 14),
                                                    this.color);
        scene.add(this.mainAxisVisual);

        if (this.callback !== undefined){
            this.drct = this.mainAxis.applyAxisAngle(this.normal, this.value);
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
        
    }

    resize(newValue){
        this.remove();

        this.value = newValue;

        this.render();
    }

     onMouseDown(event) {
        let obj = [this.drctVisual];
        let intersection = (raycaster.intersectObjects(obj))[0];
        if ((intersection !== undefined)&&(event.button == 0)) { //check if the mouse button pressed is left 
            this.mouseUpListener = this.onMouseUp.bind(this);
            document.addEventListener('mouseup', this.MouseUpListener);
            this.mouseMoveListener = this.onMouseMove.bind(this);
            document.addEventListener('mouseup', this.MouseMoveListener);  
        }
    }

    onMouseUp() {
        document.removeEventListener('mouseup', this.MouseUpListener);
        document.removeEventListener('mousemove', this.MouseMoveListener);
    } 

    onMouseMove() {
        //let intersection = (raycaster.intersectObjects([this.drctVisual]))[0];
        //if (intersection !== undefined) {

        //}

    }

    remove() {
        scene.remove(this.visual);
        scene.remove(this.mainAxisVisual);
        if (this.callback !== undefined){
            scene.remove(this.drctVisual);
        };
    }
}