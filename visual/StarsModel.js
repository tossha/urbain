class VisualStarsModel
{
    constructor(data) {

        let threeGeometry = new THREE.Geometry();

        const starDist = 1e12;

        for(let params of STARDATA) {

            threeGeometry.vertices.push(new THREE.Vector3(
                starDist * Math.cos(deg2rad(params[0])) * Math.sin(deg2rad(params[1])),
                starDist * Math.sin(deg2rad(params[0])) * Math.sin(deg2rad(params[1])),
                starDist * Math.cos(deg2rad(params[1]))
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