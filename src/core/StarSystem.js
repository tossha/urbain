import ReferenceFrameFactory from "./ReferenceFrame/Factory";
import Body from "./Body";
import Events from "./Events";

export default class StarSystem {
    /**
     * @param {string} id
     * @param {string} name
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.stars = null;
        this.mainObject = null;
        this.referenceFrames = {};
        this.objects = {};
        this.created = 0;
    }

    /**
     * @return {StarSystem}
     */
    get instance() {
        return this;
    }

    get fileName() {
        return `${this.id}.json`;
    }

    /**
     * @param starSystemLoader
     * @param onLoaded
     * @returns {Promise}
     */
    load(starSystemLoader, onLoaded) {
        return Promise.resolve();
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
        return new Promise(resolve => {
            this.objects[id].drop();
            delete this.objects[id];

            resolve();
        })
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
