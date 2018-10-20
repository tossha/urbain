import VisualTrajectoryFactory from "./Factory";

/**
 * This class is not meant to render anything,
 * but rather to control rendering of separate
 * parts of composite trajectories
 */
export default class VisualTrajectoryModelComposite
{
    constructor(trajectory, config) {
        this.trajectory = trajectory;
        this.config = config;
        this.defaultComponentConfig = config.defaultComponentConfig || {};
    }

    addComponent(component, configOverrides) {
        let config = _deepMerge(this.defaultComponentConfig, configOverrides);
        let componentModel = VisualTrajectoryFactory.createFromConfig(component, config);
        component.setVisualModel(componentModel);
    }

    addFlightEvent(flightEvent) {

    }
}

function _deepMerge(target, source) {
    const _isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item));
    let output = Object.assign({}, target);

    if (_isObject(target) && _isObject(source)) {
        Object.keys(source).forEach(key => {
            if (_isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = deepMerge(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}