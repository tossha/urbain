class HelperAngle
{
    constructor(/*mainAxis, center, point*/) {
        let pos = point.sub(center);
        let angle = Math.acos(pos.dot(mainAxis) / (pos.mag * mainAxis.mag));
        angle = () ? angle : angle +

        var geometry = new THREE.CircleGeometry(/*pos.mag,
                                              200,
                                              0,
                                              angle

                                              ///////////////////*/)
    }
}