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
}
