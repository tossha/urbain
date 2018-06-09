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
}

Events.RENDER = 'urb_render';
Events.INIT_DONE = 'urb_init_done';
Events.SELECT = 'urb_select';
Events.DESELECT = 'urb_deselect';
Events.CAMERA_RF_CHANGED = 'urb_camera_rf_change';
Events.OBJECT_ADDED = 'urb_object_added';
Events.TIME_SCALE_CHANGED = 'urb_time_scale_change';
Events.TIME_PAUSED = 'urb_time_paused';
Events.TIME_UNPAUSED = 'urb_time_unpaused';
Events.EPOCH_CHANGED = 'urb_epoch_change';
