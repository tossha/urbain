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