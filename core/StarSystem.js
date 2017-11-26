class StarSystem
{
    constructor(id) {
        this.id = id;
        this.name = null;
        this.stars = null;
        this.mainObject = null;
        this.referenceFrames = {};
        this.trajectories = {};
        this.objects = {};
    }

    addStars(stars) {
        this.stars = stars;
    }

    addReferenceFrame(frame) {
        this.referenceFrames[frame.id] = frame;
    }

    getReferenceFrame(id) {
        if (this.referenceFrames[id] === undefined) {
            this.referenceFrames[id] = ReferenceFrameFactory.createById(this, id);
        }
        return this.referenceFrames[id];
    }

    getTrajectory(objectId) {
        if (this.trajectories && this.trajectories[objectId]) {
            return this.trajectories[objectId];
        }
        return null;
    }

    addTrajectory(objectId, trajectory) {
        this.trajectories[objectId] = trajectory;
    }

    deleteTrajectory(objectId) {
        this.trajectories[objectId].drop();
        delete this.trajectories[objectId];
    }

    getObject(id) {
        if (this.objects && this.objects[id]) {
            return this.objects[id];
        }
        return null;
    }

    getObjectNames() {
        let names = {};
        for (const object of Object.values(this.objects)) {
            names[object.id] = object.name;
        }
        return names;
    }

    getBodies() {
        let bodies = [];
        for (const object of Object.values(this.objects)) {
            if (object instanceof Body) {
                bodies.push(object);
            }
        }
        return bodies;
    }

    addObject(id, body) {
        this.objects[id] = body;
    }

    deleteObject(id) {
        this.objects[id].drop();
        delete this.objects[id];
    }
}