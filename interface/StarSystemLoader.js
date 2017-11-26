class StarSystemLoader
{
    static loadFromConfig(config) {
        let starSystem = new StarSystem(config.id);

        // Loading name
        starSystem.name = config.name;

        // Loading main object
        starSystem.mainObject = config.mainObject;

        // Loading reference frames
        starSystem.addReferenceFrame(
            ReferenceFrameFactory.create(starSystem, RF_BASE, ReferenceFrame.BASE)
        );

        for (const frame of config.referenceFrames) {
            starSystem.addReferenceFrame(
                ReferenceFrameFactory.create(starSystem, frame.id, frame.type, frame.config)
            );
        }

        // Loading objects
        for (const objectConfig of config.objects) {
            this._loadObject(starSystem, objectConfig);
        }

        // Loading stars
        starSystem.addStars(new VisualStarsModel(config.stars));

        return starSystem;
    }

    static _loadObject(starSystem, config) {
        let trajectory = TrajectoryLoader.create(starSystem, config.trajectory);
        let object;

        starSystem.addTrajectory(config.id, trajectory);

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
                starSystem,
                config.id,
                config.name,
                trajectory,
                visualModel,
                new PhysicalBodyModel(
                    config.physical.mu,
                    config.physical.radius
                ),
                orientation
            );
        } else {
            object = new EphemerisObject(
                starSystem,
                config.id,
                config.name,
                trajectory
            );
        }

        starSystem.addObject(
            config.id,
            object
        );
    }
}