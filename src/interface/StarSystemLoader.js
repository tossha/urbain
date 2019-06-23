import $ from "jquery";

import ReferenceFrameFactory, {RF_BASE_OBJ} from "../core/ReferenceFrame/Factory";
import Body from "../core/Body";
import OrientationConstantAxis from "../core/Orientation/ConstantAxis";
import PhysicalBodyModel from "../core/PhysicalBodyModel";
import EphemerisObject from "../core/EphemerisObject";
import TrajectoryLoader from "./TrajectoryLoader";
import VisualStarsModel from "../core/visual/StarsModel";
import VisualBodyModelLight from "../core/visual/BodyModel/Light";
import VisualBodyModelRings from "../core/visual/BodyModel/Rings";
import VisualBodyModelBasic from "../core/visual/BodyModel/Basic";
import VisualShapeSphere from "../core/visual/Shape/Sphere";
import Events from "../core/Events";
import { sim } from "../core/simulation-engine";
import {STAR_SYSTEM_BARYCENTER} from "../core/StarSystem";

export default class StarSystemLoader
{
    static loadFromConfig(starSystem, config) {
        // Loading name
        starSystem.name = config.name;

        // Loading main object
        starSystem.mainObject = config.mainObject;

        starSystem.addObject(
            STAR_SYSTEM_BARYCENTER,
            new EphemerisObject(STAR_SYSTEM_BARYCENTER, EphemerisObject.TYPE_POINT, 'Star system barycenter')
        );

        // Loading objects
        for (const objectConfig of config.objects) {
            this._loadObject(starSystem, objectConfig);
        }

        Events.dispatch(Events.LOADING_BODIES_DONE);

        // Loading reference frames
        starSystem.addReferenceFrame(RF_BASE_OBJ);

        for (const frame of config.referenceFrames) {
            starSystem.addReferenceFrame(
                ReferenceFrameFactory.create(frame.id, frame.type, frame.config)
            );
        }

        Events.dispatch(Events.LOADING_FRAMES_DONE);

        // Loading trajectories
        for (const objectConfig of config.objects) {
            starSystem.getObject(objectConfig.id).setTrajectory(TrajectoryLoader.create(objectConfig.trajectory));
        }

        Events.dispatch(Events.LOADING_TRAJECTORIES_DONE);

        // Loading stars
        starSystem.addStars(new VisualStarsModel(config.stars));
    }

    /**
     * @param starSystem
     * @param {string} url
     * @return {Promise<any>}
     */
    static loadObjectByUrl(starSystem, url) {
        return Promise.resolve($.getJSON(url, (objectConfig) => {
            this._loadObject(starSystem, objectConfig);
            starSystem.getObject(objectConfig.id).setTrajectory(TrajectoryLoader.create(objectConfig.trajectory));
        }));
    }

    static _loadObject(starSystem, config) {
        let object;
        let visualModel = null;
        let physicalModel = null;
        let orientation = null;

        if (config.visual) {
            const visualShape = new VisualShapeSphere(
                config.visual.config.radius,
                config.visual.config.texturePath ? 32 : 12
            );
            const visualModelClass = {
                'basic': VisualBodyModelBasic,
                'light': VisualBodyModelLight,
                'rings': VisualBodyModelRings,
            }[config.visual.model];

            if (visualModelClass !== undefined) {
                visualModel = new visualModelClass(visualShape, config.visual.config);
            }
        }

        if (config.physical || config.orientation) {
            if (!config.orientation) {
                config.orientation = {
                    type: 'constantAxis',
                    config: {
                        vector: [0, 0, 1e-11]
                    }
                };
            }
            let className;
            if (config.orientation.type === 'constantAxis') {
                className = OrientationConstantAxis;
            } else {
                className = sim.getClass(config.orientation.type);
            }
            orientation = new className(config.orientation.config);
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
                config.name,
                config.data,
                visualModel,
                physicalModel,
                orientation
            );
        } else {
            object = new EphemerisObject(
                config.id,
                config.type || EphemerisObject.TYPE_UNKNOWN,
                config.name,
                config.data
            );
        }

        starSystem.addObject(
            config.id,
            object
        );
    }
}
