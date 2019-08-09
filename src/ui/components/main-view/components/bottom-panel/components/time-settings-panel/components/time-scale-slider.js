import { inject } from "mobx-react";
import Slider from "../../../../../../common/slider";

const TimeScaleSlider = inject(({ timeSettingsPanelStore }) => ({
    value: timeSettingsPanelStore.sliderValue,
    onChange: timeSettingsPanelStore.onTimeScaleSliderChange,
}))(Slider);

export default TimeScaleSlider;
