import $ from "jquery";

import ReferenceFrameFactory, {ReferenceFrame, RF_BASE} from "../core/ReferenceFrame/Factory";
import {SATURN, SUN} from "../solar_system";
import Body from "../core/Body";
import OrientationIAUModel from "../core/Orientation/IAUModel";
import OrientationConstantAxis from "../core/Orientation/ConstantAxis";
import PhysicalBodyModel from "../core/PhysicalBodyModel";
import EphemerisObject from "../core/EphemerisObject";
import TrajectoryLoader from "./TrajectoryLoader";
import VisualStarsModel from "../visual/StarsModel";
import VisualBodyModelLight from "../visual/BodyModel/Light";
import VisualBodyModelRings from "../visual/BodyModel/Rings";
import VisualBodyModelBasic from "../visual/BodyModel/Basic";
import VisualShapeSphere from "../visual/Shape/Sphere";

export default class StarSystemLoader
{
    static loadFromConfig(starSystem, config) {
        // Loading name
        starSystem.name = config.name;

        // Loading main object
        starSystem.mainObject = config.mainObject;

        starSystem.addObject(0, new EphemerisObject(0, EphemerisObject.TYPE_POINT, 'Star system barycenter'));

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

    static loadObjectByUrl(starSystem, url) {
        $.getJSON(url, (objectConfig) => {
            this._loadObject(starSystem, objectConfig);
            starSystem.addTrajectory(objectConfig.id, TrajectoryLoader.create(objectConfig.trajectory))
        });
    }

    static loadTLE(starSystem, noradId) {
        const path = Math.floor(noradId / 1000);
        this.loadObjectByUrl(starSystem, './spacecraft/' + path + '/' + noradId + '.json.gz');
    };

    static _loadObject(starSystem, config) {
        let object;
        let visualModel = null;
        let physicalModel = null;
        let orientation = null;

        if (config.visual) {
            let visualShape = new VisualShapeSphere(
                config.visual.radius,
                config.visual.texture ? 32 : 12
            );

            visualModel = (config.id == SUN)
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
        }

        if (config.orientation) {
            orientation = config.orientation
                ? new OrientationIAUModel(
                    config.orientation[0], // right ascension
                    config.orientation[1], // declination
                    config.orientation[2]  // prime meridian
                )
                : new OrientationConstantAxis([0, 0, 1e-10]);
        }

        if (config.physical) {
            physicalModel = new PhysicalBodyModel(
                config.physical
            );
        }

        if (visualModel || physicalModel || orientation) {
            object = new Body(
                config.id,
                config.type || EphemerisObject.TYPE_UNKNOWN,
                config.parentSoi || null,
                config.name,
                visualModel,
                physicalModel,
                orientation
            );
        } else {
            object = new EphemerisObject(
                config.id,
                config.type || EphemerisObject.TYPE_UNKNOWN,
                config.name
            );
        }

        starSystem.addObject(
            config.id,
            object
        );
    }
}
