class VisualTrajectoryModelKeplerianArray extends VisualTrajectoryModelKeplerianOrbit
{
    getKeplerianObject(epoch) {
        return this.trajectory.getKeplerianObjectByEpoch(epoch);
    }
}