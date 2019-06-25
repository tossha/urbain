export default class Events
{
    static dispatch(event, detail) {
        let eventObj;
        if (detail) {
            eventObj = new CustomEvent(
                event,
                {detail: detail}
            );
        } else {
            eventObj = new CustomEvent(event);
        }
        document.dispatchEvent(eventObj);
    }

    static addListener(event, handler) {
        return document.addEventListener(event, handler);
    }

    static removeListener(event, handler) {
        return document.removeEventListener(event, handler);
    }

    static LOADING_BODIES_DONE = 'urb_load_bodies_done';
    static LOADING_FRAMES_DONE = 'urb_load_frames_done';
    static LOADING_TRAJECTORIES_DONE = 'urb_load_traj_done';

    static RENDER = 'urb_render';
    static STAR_SYSTEM_LOADED = 'urb_star_system_loading_done';
    static SELECT = 'urb_select';
    static DESELECT = 'urb_deselect';
    static SHOW_ORBIT_ANGLES_CHANGED = 'urb_show_orbit_angles_change';
    static CAMERA_RF_CHANGED = 'urb_camera_rf_change';
    static OBJECT_ADDED = 'urb_object_added';
    static FORCE_EPOCH_CHANGED = 'urb_force_epoch_change';
}
