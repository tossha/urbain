import $ from "jquery";

import ReferenceFrameFactory, {RF_BASE_OBJ} from "./ReferenceFrame/Factory";
import Body from "./Body";
import PhysicalBodyModel from "./PhysicalBodyModel";
import EphemerisObject from "./EphemerisObject";
import TrajectoryLoader from "./TrajectoryLoader";
import VisualStarsModel from "./visual/StarsModel";
import VisualBodyModelLight from "./visual/BodyModel/Light";
import VisualBodyModelRings from "./visual/BodyModel/Rings";
import VisualBodyModelBasic from "./visual/BodyModel/Basic";
import VisualShapeSphere from "./visual/Shape/Sphere";
import Events from "./Events";
import OrientationFactory from "./Orientation/factory";
import { OrientationType, STAR_SYSTEM_BARYCENTER } from "./constants";

export default class StarSystemLoader {
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

    /**
     * @param {StarSystem} starSystem
     * @param config
     * @private
     */
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
                    type: OrientationType.ConstantAxis,
                    config: {
                        vector: [0, 0, 1e-11]
                    }
                };
            }

            orientation = OrientationFactory.createOrientation(config.orientation.type, config.orientation.config);
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
