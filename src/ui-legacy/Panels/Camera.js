import $ from "jquery";

import Events from "../../core/Events";
import UIPanel from "../Panel";
import {ReferenceFrame} from "../../core/ReferenceFrame/Factory";

export default class UIPanelCamera extends UIPanel
{
    constructor(panelDom, camera) {
        super(panelDom);

        this.camera = camera;

        this.jqTarget = this.jqDom.find('#targetSelect');
        this.jqTarget.on('change', () => this.camera.changeOrigin(0|this.jqTarget.val()));

        this.jqFrameType = this.jqDom.find('#rfTypeSelect');
        this.jqFrameType.on('change', () => this.camera.changeReferenceFrameType(0|this.jqFrameType.val()));

        Events.addListener(Events.STAR_SYSTEM_LOADED, (event) => {
            this.starSystem = event.detail.starSystem;

            this.jqTarget.html('');
            this.updateTargetList();
            this.updateTarget(this.camera.orbitingPoint);

            this.updateFrameTypeList();
            this.updateFrameType(this.camera.frameType);
        });
        Events.addListener(Events.CAMERA_RF_CHANGED, (event) => {
            this.updateTarget(event.detail.new.originId);
            this.updateFrameTypeList();
            this.updateFrameType(event.detail.new.type);
        });
        Events.addListener(Events.OBJECT_ADDED, () => {
            this.updateTargetList();
        });
    }

    updateTargetList() {
        if (!this.starSystem) {
            return;
        }
        $.each(this.starSystem.getObjectNames(), (objId, objName) => {
            if (this.jqTarget.find("option[value='" + objId + "']").length === 0) {
                this.jqTarget.append($('<option>', {value: objId}).text(objName));
            }
        });
    }

    updateFrameTypeList() {
        const selected = 0|this.jqFrameType.val();
        this.jqFrameType.html('');
        $.each(this.camera.getAvailableFrameTypes(), (idx, typeId) => {
            this.jqFrameType.append($('<option>', {value: typeId, selected: typeId == selected}).text(UIPanelCamera.frameTypeNames[typeId]));
        });
    }

    updateTarget(value) {
        this.jqTarget.val(value);
    }

    updateFrameType(value) {
        this.jqFrameType.val(value);
    }
}

UIPanelCamera.frameTypeNames = {
    [ReferenceFrame.INERTIAL_ECLIPTIC]: 'Ecliptic',
    [ReferenceFrame.INERTIAL_BODY_EQUATORIAL]: 'Equatorial',
    [ReferenceFrame.INERTIAL_BODY_FIXED]: 'Body fixed',
    [ReferenceFrame.INERTIAL_PARENT_BODY_EQUATORIAL]: 'Parent equatorial',
};
