class App {
    static getReferenceFrame(origin, type) {
        this.frames = this.frames || {};
        this.frames[origin] = this.frames[origin] || {};

        const typeClasses = {
            [RF_TYPE_ECLIPTIC]: ReferenceFrameEcliptic,
            [RF_TYPE_EQUATORIAL]: ReferenceFrameEquatorial,
            [RF_TYPE_ROTATING]: ReferenceFrameRotating
        };

        if (!typeClasses[type]){
            return null;
        }

        this.frames[origin][type] = this.frames[origin][type] || new (typeClasses[type])(origin);
        return this.frames[origin][type];
    }

    static getTrajectory(objectId) {
        if (this.trajectories && this.trajectories[objectId]) {
            return this.trajectories[objectId];
        }
        return null;
    }

    static setTrajectory(objectId, trajectory) {
        this.trajectories = this.trajectories || {};
        this.trajectories[objectId] = trajectory;
    }

    static deleteTrajectory(objectId) {
        delete this.trajectories[objectId];
    }
}