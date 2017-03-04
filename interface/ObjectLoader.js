class ObjectLoader
{
    static loadFromCnfig(config) {
        for (let bodyId in config) {
            this.loadObject(bodyId, config[bodyId]);
        }
    }

    static loadObject(bodyId, data) {
        let trajectory = TrajectoryLoader.create(data);

        App.setTrajectory(bodyId, trajectory);

        if (data.radius) {
            let visualShape = new VisualShapeSphere(
                data.radius,
                data.texture ? 32 : 12
            );

            let visualModel = (bodyId == SUN)
                ? new VisualBodyModelLight(
                    visualShape,
                    data.color,
                    data.texture,
                    0xFFFFFF,
                    1.5,
                    null,
                    null
                )
                : new VisualBodyModelBasic(
                    visualShape,
                    data.color,
                    data.texture
                );
            let orientation = data.orientation
                ? new OrientationIAUModel(
                    data.orientation[0], // right ascension
                    data.orientation[1], // declination
                    data.orientation[2]  // prime meridian
                )
                : new OrientationConstantAxis([0, 0, 1e-10]);

            BODIES[bodyId] = new Body(
                visualModel,
                new PhysicalBodyModel(
                    data.mu,
                    data.radius
                ),
                trajectory,
                orientation
            );
        }
    }
}