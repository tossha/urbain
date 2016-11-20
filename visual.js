"use_strict";

class VisualBodyModel
{
    constructor(shape, color, texturePath) {
        this.shape = shape;   // class VisualShapeAbstract
        this.color = color;
        this.body = null; // class Body
        
        this.threeObj = new THREE.Mesh(
            this.shape.getThreeGeometry(),
            this.getMaterial({color: this.color, wireframe: true})
        );
        
        scene.add(this.threeObj);

        if (texturePath !== undefined) {
            var that = this;
            
            textureLoader.load(
                COMMON_TEXTURE_PATH + texturePath,
                function(txt) {
                    that.threeObj.material.dispose();
                    that.threeObj.material = that.getMaterial({map: txt});
                },
                undefined,
                function(err) { 
                    console.log(err);
                }                    
            );
        }
    }

    getMaterial(parameters) {
    	parameters.metalness = 0;
    	parameters.roughness = 1;
    	return new THREE.MeshStandardMaterial(parameters);
    }

    render(epoch, pos) {
        this.threeObj.position.set(pos.x, pos.y, pos.z);
        this.threeObj.quaternion.copy(
            this.body.orientation.getOrientationByEpoch(epoch)
        );
    }
}

class VisualBodyModelLight extends VisualBodyModel
{
    constructor(shape, color, texturePath, lightColor, lightIntensity, lightDistance, lightDecay) {
        super(shape, color, texturePath);

        this.light = new THREE.PointLight(lightColor, lightIntensity, lightDistance, lightDecay);
        scene.add(this.light);
    }

    render(epoch, pos) {
        super.render(epoch, pos);
        this.light.position.set(pos.x, pos.y, pos.z);
    }

    getMaterial(parameters) {
    	return new THREE.MeshBasicMaterial(parameters);
    }
}

class VisualTrajectoryModelAbstract
{
    constructor(trajectory, color) {
        this.trajectory = trajectory;
        this.color = color;

        this.threeObj = new THREE.Line(
            new THREE.Geometry(),
            new THREE.LineBasicMaterial({color: this.color, vertexColors: THREE.VertexColors})
        );

        scene.add(this.threeObj);
    }

    drop()
    {
        scene.remove(this.threeObj);
        this.threeObj.geometry.dispose();
        this.threeObj.material.dispose();
        delete this.threeObj;
    }

    render(epoch) {}
}

class VisualTrajectoryModelKeplerianOrbit extends VisualTrajectoryModelAbstract
{
    render(epoch) {
        const endingBrightness = 0.35;

        const traj = this.trajectory;
        const centerPos = traj.referenceFrame.transformPositionByEpoch(epoch, ZERO_VECTOR, RF_BASE);
        const dr = -traj.sma * traj.e;
        const ta = traj.getTrueAnomaly(epoch);
        const mainColor = new THREE.Color(this.color);
        let lastVertexIdx;
        let ang = Math.acos(
            (traj.e + Math.cos(ta)) / (1 + traj.e * Math.cos(ta))
        );

        if (ta > Math.PI) {
            ang = 2 * Math.PI - ang;
        }

        this.threeObj.geometry.dispose();
        this.threeObj.geometry = (new THREE.Path(
            (new THREE.EllipseCurve(
                dr * Math.cos(traj.aop),
                dr * Math.sin(traj.aop),
                traj.sma,
                traj.sma * Math.sqrt(1 - traj.e * traj.e),
                ang,
                2 * Math.PI + ang - 0.0000000000001,  // protection from rounding errors
                false,
                traj.aop
            )).getPoints(100)
        )).createPointsGeometry(100).rotateX(traj.inc);

        lastVertexIdx = this.threeObj.geometry.vertices.length - 1;

        for (let i = 0; i <= lastVertexIdx; i++) {
            let curColor = (new THREE.Color()).copy(mainColor);
            let mult = endingBrightness + (1 - endingBrightness) * i / lastVertexIdx;

            this.threeObj.geometry.colors.push(
                curColor.multiplyScalar(mult)
            );
        }

        this.threeObj.rotation.z = traj.raan;

        this.threeObj.position.set(centerPos.x, centerPos.y, centerPos.z);
    }
}

class VisualTrajectoryModelStateArray extends VisualTrajectoryModelAbstract
{
    render(epoch) {
        const traj = this.trajectory;

        if (traj.states.length < 2) {
            return;
        }

        this.threeObj.geometry.dispose();

        let geometry = new THREE.Geometry();
        for (let i = 0; i < traj.states.length; ++i) {
            const position = traj.states[i].state.position;
            geometry.vertices.push(new THREE.Vector3(
                position.x,
                position.y,
                position.z
            ));
            geometry.colors.push(new THREE.Color(this.color));
        }

        this.threeObj.geometry = geometry;
    }
}

class VisualShapeAbstract
{
    getThreeGeometry() {}
}

class VisualShapeSphere extends VisualShapeAbstract
{
    constructor(radius, segments) {
        super();

        this.threeGeometry = new THREE.SphereGeometry(radius, segments * 2, segments);
        this.threeGeometry.rotateX(Math.PI / 2);
    }

    getThreeGeometry() {
        return this.threeGeometry;
    }
}

class VisualStarsModel
{
    constructor(data) {

        let threeGeometry = new THREE.Geometry();

        for(let params of STARDATA) {

            threeGeometry.vertices.push(new THREE.Vector3(
                1e12 * Math.cos(deg2rad(params[0])) * Math.sin(deg2rad(params[1])), 
                1e12 * Math.sin(deg2rad(params[0])) * Math.sin(deg2rad(params[1])), 
                1e12 * Math.cos(deg2rad(params[1]))
            ));

            threeGeometry.colors.push(new THREE.Color(
                params[2] / 100,
                params[2] / 100,
                params[2] / 100
            )); 
        }

        this.threeObj = new THREE.Points(
            threeGeometry,
            new THREE.PointsMaterial({
                vertexColors: THREE.VertexColors,
                size: 2,
                sizeAttenuation: false
            })
        );

        scene.add(this.threeObj); 
    }
}

class VisualShapeModel extends VisualShapeAbstract
{
    constructor(modelFile) {
        super();
        
        this.modelFile = modelFile;
    }

    getThreeGeometry() {
        // @todo implement
    }
}
