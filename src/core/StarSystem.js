import ReferenceFrameFactory from "./ReferenceFrame/Factory";
import EphemerisObject from "./EphemerisObject";
import Body from "./Body";
import Events from "./Events";

export const STAR_SYSTEM_BARYCENTER = 0;

export default class StarSystem
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
        return this;
    }

    addReferenceFrame(frame) {
        this.referenceFrames[frame.id] = frame;
    }

    getReferenceFrame(id) {
        if (this.referenceFrames[id] === undefined) {
            this.referenceFrames[id] = ReferenceFrameFactory.createById(id);
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
        this.getObject(objectId).setTrajectory(trajectory);
    }

    deleteTrajectory(objectId) {
        this.trajectories[objectId].drop();
        delete this.trajectories[objectId];
    }

    getObject(id) {
        if (this.objects[id] === undefined) {
            this.objects[id] = new EphemerisObject(id, EphemerisObject.TYPE_UNKNOWN, 'Unknown #' + id);
        }
        return this.objects[id];
    }

    getCommonParentObject(object1, object2, epoch1, epoch2) {
        if (epoch2 === undefined) {
            epoch2 = epoch1;
        }

        let chain1 = [object1];
        let parent;

        while (parent = this.getObject(chain1[chain1.length-1]).getParentObjectIdByEpoch(epoch1)) {
            chain1.push(parent);
        }
        chain1.push(0);

        parent = object2;
        while ((parent = this.getObject(parent).getParentObjectIdByEpoch(epoch2)) !== null) {
            if (chain1.indexOf(parent) !== -1) {
                return this.getObject(parent);
            }
        }

        return null;
    }

    isBody(objectId) {
        if (this.objects[objectId] === undefined) {
            return null;
        }
        return this.objects[objectId] instanceof Body;
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
        Events.dispatch(Events.OBJECT_ADDED, {object: body});
    }

    deleteObject(id) {
        this.objects[id].drop();
        delete this.objects[id];
    }
}