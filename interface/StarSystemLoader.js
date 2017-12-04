class StarSystemLoader
{
    static loadFromConfig(starSystem, config) {
        // Loading name
        starSystem.name = config.name;

        // Loading main object
        starSystem.mainObject = config.mainObject;

        // Loading objects
        for (const objectConfig of config.objects) {
            this._loadObject(starSystem, objectConfig);
        }

        // Loading reference frames
        starSystem.addReferenceFrame(
            ReferenceFrameFactory.create(RF_BASE, ReferenceFrame.BASE)
        );

        for (const frame of config.referenceFrames) {
            starSystem.addReferenceFrame(
                ReferenceFrameFactory.create(frame.id, frame.type, frame.config)
            );
        }

        // Loading trajectories
        for (const objectConfig of config.objects) {
            starSystem.addTrajectory(objectConfig.id, TrajectoryLoader.create(objectConfig.trajectory));
        }

        // Loading stars
        starSystem.addStars(new VisualStarsModel(config.stars));
    }

    static _loadObject(starSystem, config) {
        let object;

        if (config.visual) {
            let visualShape = new VisualShapeSphere(
                config.visual.radius,
                config.visual.texture ? 32 : 12
            );

            let visualModel = (config.id == SUN)
                ? new VisualBodyModelLight(
                    visualShape,
                    config.visual.color,
                    config.visual.texture,
                    0xFFFFFF,
                    1.5,
                    null,
                    null
                )
                : ((config.id == SATURN)
                        ? new VisualBodyModelRings(
                            visualShape,
                            config.visual.color,
                            config.visual.texture.split('&')[0],
                            config.visual.texture.split('&')[1],
                            config.visual.texture.split('&')[2]
                        )
                        : new VisualBodyModelBasic(
                            visualShape,
                            config.visual.color,
                            config.visual.texture
                        )
                );
            let orientation = config.orientation
                ? new OrientationIAUModel(
                    config.orientation[0], // right ascension
                    config.orientation[1], // declination
                    config.orientation[2]  // prime meridian
                )
                : new OrientationConstantAxis([0, 0, 1e-10]);

            object = new Body(
                config.id,
                config.name,
                visualModel,
                new PhysicalBodyModel(
                    config.physical.mu,
                    config.physical.radius
                ),
                orientation
            );
        } else {
            object = new EphemerisObject(
                config.id,
                config.name
            );
        }

        starSystem.addObject(
            config.id,
            object
        );
    }
}