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