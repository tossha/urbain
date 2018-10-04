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

    static RENDER = 'urb_render';
    static INIT_DONE = 'urb_init_done';
    static SELECT = 'urb_select';
    static DESELECT = 'urb_deselect';
    static CAMERA_RF_CHANGED = 'urb_camera_rf_change';
    static OBJECT_ADDED = 'urb_object_added';
    static TIME_SCALE_CHANGED = 'urb_time_scale_change';
    static TIME_PAUSED = 'urb_time_paused';
    static TIME_UNPAUSED = 'urb_time_unpaused';
    static EPOCH_CHANGED = 'urb_epoch_change';
}
