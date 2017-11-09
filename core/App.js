class App {
    static getTrajectory(objectId) {
        if (this.trajectories && this.trajectories[objectId]) {
            return this.trajectories[objectId];
        }
        return null;
    }

    static setTrajectory(objectId, trajectory) {
        this.trajectories = this.trajectories || {};
        trajectory.setId(objectId);
        this.trajectories[objectId] = trajectory;
    }

    static deleteTrajectory(objectId) {
        this.trajectories[objectId].drop();
        delete this.trajectories[objectId];
    }
}