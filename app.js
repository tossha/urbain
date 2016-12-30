class App {
    static getReferenceFrame(origin, type) {
        this.frames = this.frames || {};
        this.frames[origin] = this.frames[origin] || {};

        let neededType;

        switch(type) {
            case RF_TYPE_ECLIPTIC:
                neededType = ReferenceFrameEcliptic;
                break;

            case RF_TYPE_EQUATORIAL:
                neededType = ReferenceFrameEquatorial;
                break;

            case RF_TYPE_ROTATING:
                neededType = ReferenceFrameRotating;
                break;
        }

        this.frames[origin][type] = this.frames[origin][type] || new neededType(origin);
        return this.frames[origin][type];
    }
}
