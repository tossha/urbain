class KeplerianEditor 
{
    constructor(trajectory, isEditMode) {
        this.isEditMode = isEditMode;
        this.trajectory = trajectory;
    }
    static editExisting() {
        
    }

    static createNew() {
        if (KeplerianEditor.isEditMode !== true) {

            if (BODIES[settings.trackingObject] !== undefined) {
                KeplerianEditor.helperGrid = new HelperGrid(settings.trackingObject);
                KeplerianEditor.isEditMode = true; 

                document.addEventListener('vr_render', function (event) {
                    KeplerianEditor.helperGrid.update(TRAJECTORIES[EARTH].getPositionByEpoch(time.epoch, RF_BASE));
                });
            };

            //plane
        };

        
    }

    static abortCreating() {
        if ((KeplerianEditor.isEditMode)&&(KeplerianEditor.helperGrid !== undefined)) {
            KeplerianEditor.helperGrid.remove();

            KeplerianEditor.isEditMode = false;
        };
    }
}