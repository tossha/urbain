class App {
    static getReferenceFrame(type, origin) {
        if (type === RF_TYPE_ECI) {
            origin = EARTH;
        }

        this.frames = this.frames || {};
        this.frames[origin] = this.frames[origin] || {};

        const typeClasses = {
            [RF_TYPE_ECLIPTIC]: ReferenceFrameEcliptic,
            [RF_TYPE_EQUATORIAL]: ReferenceFrameEquatorial,
            [RF_TYPE_ROTATING]: ReferenceFrameRotating,
            [RF_TYPE_ECI]: ReferenceFrameEquatorial,
            [RF_TYPE_ICRF]: ReferenceFrameICRF,
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
        trajectory.setId(objectId);
        this.trajectories[objectId] = trajectory;
    }

    static deleteTrajectory(objectId) {
        this.trajectories[objectId].drop();
        delete this.trajectories[objectId];
    }
}