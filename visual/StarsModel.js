class VisualStarsModel extends VisualModelAbstract
{
    constructor(data) {
        super();

        let threeGeometry = new THREE.Geometry();

        const starDist = 1e12;

        for(let params of data) {

            threeGeometry.vertices.push(new THREE.Vector3(
                starDist * Math.cos(deg2rad(params[0])) * Math.cos(deg2rad(params[1])),
                starDist * Math.sin(deg2rad(params[0])) * Math.cos(deg2rad(params[1])),
                starDist * Math.sin(deg2rad(params[1]))
            ));

            threeGeometry.colors.push(new THREE.Color(
                params[2] / 50,
                params[2] / 50,
                params[2] / 50
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

        this.threeObj.quaternion.copy(new Quaternion([-1, 0, 0], deg2rad(23.4)).toThreejs());
    }
}