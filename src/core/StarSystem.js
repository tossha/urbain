import ReferenceFrameFactory from "./ReferenceFrame/Factory";
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
        this.objects = {};
        this.created = 0;
    }

    unload() {
        Object.entries(this.objects).map(entry => entry[1].drop());
        this.stars && this.stars.drop();
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

    addObject(id, body) {
        this.objects[id] = body;
        Events.dispatch(Events.OBJECT_ADDED, {object: body});
    }

    getObject(id) {
        if (this.objects[id] === undefined) {
            return null;
        }
        return this.objects[id];
    }

    deleteObject(id) {
        this.objects[id].drop();
        delete this.objects[id];
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
}